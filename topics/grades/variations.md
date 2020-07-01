---
layout: article
breadcrumbs: ["Grades", "Before variables…"]
title: Grades in responsive use
---

Grades in variable fonts have the same production advantages as grades in the past for print. Variable fonts, however, allow responsive production via suggestions for use in different conditions. Grade capability in variations, unlike working for a single style, typically works throughout the whole design space. So, if a variable font has grades, all the weights, widths, optical sizes or custom variable axes, can have grades. Grades alone, or used with other parametric axes, can improve for different rendering conditions, dark mode conditions, of simple for visually stylistic variation. 

Further elaboration 

Fonts of different styles on the same width have been in use typographically since mechanical typesetting required regular and italic fonts e.g. on the same widths, aka “duplexing”. Controlling the weight of type in production processes was left to the people and machinery spreading the ink, and controlled the speed and pressure of the presses. With digital type much or the physical process was streamlined, and typographers started asking for multiple, slightly different weights, on the same width, as the most effective way to deal with e.g. the mixture of offset and gravure processes in use in single publication.

A “grade axis” in variable fonts has the same production advantages as grades of styles in the past for print, but that the options are continuous over the ranges of all the axes, and the world now ”posts” more than it “prints”. For variable fonts, this opens up the possibility of responsive production via suggestions for use in different conditions. And because variables fonts is another word for “making the actual fonts that are used, on the user’s machine”, grades can make “responsive” very personal. So in general, a grade axis alone, or in use with other axes, can be used to improve appearance of type in different layout and rendering conditions.

When Font Bureau was approached by the developers of Opentype 1.8 about what axes to register, i.e. what to make interoperable for all software and users, they asked what FB meant by “grade”. After that, a discussion ensued that wound around exactly what grade does, escalating to the fact that the existing terms for registered axes, applied across all platforms and world scripts, are not really being concise about what the registered axes do*. . .and those are design spaces, many people, worldwide, already understand to some degree. The conversation continues, and grows.

*Wght- if monospace, expect lighter and bolder style on the same width. If proportional, expect a lighter and bolder style on the narrower and wide widths. If proportional and on static widths, expect a lighter and bolder style on static proportional widths. It the design, by way of style or being natural to a script to have more weight on the horizontal stroke, than those of the vertical, often referred to as “reverse contrast”, the effect of wdth is described differently.*

This brings one to the issue with variable fonts where an axis can’t know more than one name for it regardless of how far it goes, or what’s happening in any part of it, typographically across scripts. And, that that intersects somewhat cruelty with variable glyph that can change appearance from one Unicode to another, or a variable glyph thatcan change its appearance from being for one typographic feature to another. 
 
The grade axis was not defined to change wght, but to keep instances of wght, or any other instance at the appearance of the weight of that instance. That the same gvars can go further, and do things beyond the definition of grades, has merit in the old world of discrete fonts, but by another name.
 
One could point to google search, where “uniwidth fonts” finds monospaced typeface designs, or point to places on the web where “uniwidth” is touted as a more appropriate “modern” name for “grade”. But these fonts and ideas about fonts point to ‘changing weight’ on the same widths, as their typographic advantage. The marketing of a few of these fonts go so far as to give instructions on how much to track those uniwidth styles, away from layout compatibility, to get properly spaced weights. 
 
‘Enslaving’ too great a range of weight to one common width, as monospace fonts do, is trouble clear enough for scripts like Latin. That kind of style set in a font family, “uniwidth”, was an advantage in discrete styles, but variable fonts whose axes is include width and weight, have all the weights of all the widths, meaning the “uniwidth weights” are there, just hard to find in the current climate of confusion. 
 
It may be that users want variations to give them more design options by trial and error, but that is not the intent with the grade axis.
