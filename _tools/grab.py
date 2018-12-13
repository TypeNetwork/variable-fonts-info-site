#!/usr/bin/env python3

import csv, re, os, json
from io import StringIO
from urllib.request import urlopen

docsurl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtiV1tDjGUCRzWr3DWKZ1FC_-hifc-k3Dr6gCGyyb153ukcU1Kw0SRZdr4dXbia8-URHwtIV8dW2-s/pub?gid=0&single=true&output=csv"

docsresult = urlopen(docsurl)
docscsv = docsresult.read().decode(docsresult.info().get_content_charset('iso-8859-1'))

docs = csv.DictReader(StringIO(docscsv))

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

data = []

for row in docs:
    if not row['Published URL'] or not row['Link on site']:
        continue

    dest_file = row['Link on site'].lstrip('/')
    is_heading = dest_file.endswith('index')

    resp = urlopen(row['Published URL'])
    doc = resp.read().decode(resp.info().get_content_charset('utf-8'))

    title_title = re.search(r'<div id="header">(.*?)</div>', doc).group(1)
    sidebar_title = row['Title'] if is_heading else title_title

    #lots of stuff to clean up
    doc = re.sub(r'<script.+?</script>', '', doc, flags=re.S)
    doc = re.sub(r'^.+?<div id="contents">', '', doc, flags=re.S)
    doc = re.sub(r'</div><div id="footer">.*$', '', doc, flags=re.S)
    
    #convert stupid google styling to real elements
    classes = {}
    for m in re.findall(r'\.(c\d+)\{(.+?)\}', doc):
        cls = m[0]
        rules = m[1]
        for rule in rules.split(';'):
            k, v = rule.split(':', 1)
            k = k.strip()
            v = v.strip()
            if k in ('font-weight', 'font-style') and v not in ('normal', '400'):
                if cls not in classes:
                    classes[cls] = {}
                classes[cls][k] = v.strip()

    #now zap the styles
    doc = re.sub(r'<style.+?</style>', '', doc, flags=re.S)

    #decode manually typed HTML
    doc = doc.replace('&lt;', '<')
    doc = doc.replace('&gt;', '>')
    doc = re.sub(r'(?<=[=\s])&quot;|&quot;(?=[\s>])', '"', doc)

    #replace spans with semantic elements
    for cls, rules in classes.items():
        tags = []
        if rules.get('font-weight') in ('bold', '700'):
            tags.append('strong')
        if rules.get('font-style') == 'italic':
            tags.append('em')
        if tags:
            doc = re.sub(r'<span class="{}">(.*?)</span>'.format(cls), 
                r'<{opentags}>\1</{closetags}>'.format(
                    opentags = '><'.join(tags),
                    closetags = '></'.join(reversed(tags))
                ),
                doc
            )

    doc = re.sub(r"</?span[^>]*>", "", doc) #spans
    doc = re.sub(r'\s+class="[^"]*"', "", doc) #classes
    doc = re.sub(r'<(\w+)[^>]*>\s*</\1>', '', doc) #empty tags
    doc = re.sub(r'<p[^>]*>', '\n\n', doc)
    doc = doc.replace('</p>', '')
    doc = re.sub(r'(\r?\n){2,}', '\n\n', doc)
    
    doc = doc.strip()

    outfile = dest_file + '.md'
    if re.search(r'\w+/\w+', dest_file):
        outfile = 'topics/{}'.format(outfile)

    section = re.search('topics/([^/]+)', outfile).group(1) if outfile.startswith('topics') else 'overview'

    data.append({
        'url': '/' + re.sub('(index)?\.md$', '', outfile),
        'sidebar': sidebar_title,
        'title': title_title,
        'heading': is_heading,
        'section': section,
    })

    print(outfile, sidebar_title, title_title)

    filedir = os.path.dirname(os.path.realpath(outfile))
    if not os.path.exists(filedir):
        os.makedirs(filedir, 0o755)

    with open(outfile, 'w', encoding='utf-8') as f:
        f.write("---\n")
        f.write("layout: article\n")
        f.write("breadcrumbs: [\"{}\"]\n".format(section)),
        f.write("sidebar: \"{}\"\n".format(sidebar_title))
        f.write("title: \"{}\"\n".format(title_title))
        f.write("---\n")
        f.write(doc)
        f.write("\n")

with open('_data/sidebar.json', 'w') as datafile:
    json.dump(data, datafile, indent=2)
