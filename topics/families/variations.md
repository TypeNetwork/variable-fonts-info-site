---
layout: article
breadcrumbs: ["Families", "With variables…"]
sidebar: "Variable families"
title: "Variable families"
---

Variable fonts, by and large, follow a file or two files containing designs of one family, where a regular or regular and companion italic each play their traditional roles. While it's possible within a variable font to change families, many of the files size, and interface disadvantages of the past's 'one style per file' are solved. Variable fonts containing an axis for optical sizes can be engaged automatically via the specification of size. (Fig. 1) Variable font specification can be done in web design with automated selection of widths via font-stretch.  Definition of any instance in a variable design space can be done relative to the default body style -- referencing instances of fonts from a single file. And this can happen without the composer of the typography fussing over a single style name... or, the composer can name whatever instance they like in a variable font, and e.g. refer to it in their css as "THE_BOLD_I_LIKE". 

<figure id='textedit-example' class='example'>
    <figcaption>
        <h3>Quiet use</h3>
    </figcaption>
    <img src="{{site.baseurl}}/images/articles/families/textedit-auto-opsz.png" alt="Screenshot of Mac TextEdit automatically adjusting optical size with size in a variable font">
    <figcaption>
        <p>If a variable font has an optical size (opsz) axis, an application can automatically select the optical size that matches the size the user specifies in points. Apple’s TextEdit application [version 1.13 (333)], is providing that automation as shown above.</p>
    </figcaption>
</figure>

<style>
    #finder-example ul {
        display: grid;
        grid-template-columns: auto auto;
        align-items: end;
        justify-items: center;
    }
    
    #finder-example .small img {
        width: 49px !important;
        height: 49px !important;
    }
    
    #finder-example .big img {
        width: 110px !important;
        height: 125px !important;
    }
</style>

<figure id='finder-example' class='example'>
    <figcaption>
        <h3>Even quieter use</h3>
    </figcaption>
    <ul>
        <li class='small'>
            <figure>
                <img src="{{site.baseurl}}/images/articles/families/osx-font-tile-small.png" alt="Screenshot of macOS Finder icon for a TTF file at small size.">
                <figcaption>AmstelvarAlpha-VF.ttf</figcaption>
            </figure>
        </li>
        <li class='big'>
            <figure>
                <img src="{{site.baseurl}}/images/articles/families/osx-font-tile-big.png" alt="Screenshot of macOS Finder icon for a TTF file at large size.">
                <figcaption>AmstelvarAlpha-VF.ttf</figcaption>
            </figure>
        </li>
    </ul>
    <figcaption>
        <p>Apple macOS’s use of variations includes display of different optical sizes depending on sie preferences for showing type in desktop icons.</p>
    </figcaption>
</figure>
