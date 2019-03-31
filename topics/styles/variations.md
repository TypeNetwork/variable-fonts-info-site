---
layout: article
breadcrumbs: ["Styles", "With variables…"]
sidebar: "Styles, meet instances"
title: "Styles, meet instances"
---
A variable font contains a minimum of one axis, which typically provides a fluid range of styles that are visually congruent to a central design (the “default variable”). Such a font might just contain a weight axis (**wght**) or, like many font families today, it might include styles of weight and width in various combinations. The total interpolation of axes definewhat's called the “design space” of a font family with —in contrast to the old discrete styles— instances found at every combination of each axis.

<figure>
    <img style='width:69%' src="{{site.baseurl}}/images/articles/styles/one-d-chess.svg" alt="Single-axis range: weight">
    <figcaption></figcaption>
</figure>


Replacing existing font families with variable-font families means that the variable font can contain the regular design as the default. If the original styles are all weights, the font can contain these as named instances along the wght axis, allowing the styles to show in menus, matching preexisting styles from a variable font’s design space. 

Another variable-font file could contain widths and weights in the same way, while offering all of the combinations of all of the weights and all of the widths as well (**wdth**). This may sometimes enlarge the design space of an existing font family to cover more styles than the original. Or in the example of Amstelvar, with respect for the design, the default is as wide as it gets, and the width axis only gets narrower.

<figure>
    <img src="{{site.baseurl}}/images/articles/styles/two-d-chess.svg" alt="Two-axis range: weight and width">
    <figcaption></figcaption>
</figure>

The font specification also contains an axis that is new to desktop and web software: optical size (**opsz**). Combined with weight and width, an optical size axis adds the capability to define weight and width ranges in a variable font's design space to work best for any font family, with wider ranges of both weight and width for greater impact and more efficient use of space in large sizes, and "safer" ranges of both weight and width in small sizes where type is more vulnerable to print production and web text rendering.  

<figure>
    <img src="{{site.baseurl}}/images/articles/styles/tri-d-chess.svg" alt="Three-axis range: weight, width, and optical size">
    <figcaption></figcaption>
</figure>

The italic or slant axes (**ital** and **slnt**), can also be added to a design space to bring weights, widths, and optical sizes to a family of upright and not-so-upright styles. No other registered axes exists, i.e. axes definitions written into the specification of Opentype 1.8, but variable fonts can contain numerous  custom (unregistered) axes, for variation of styles that are  new or unfamiliar to users. 

For example, in Amstelvar, Font Bureau added axes to adjust for the technical requirements of both composition and output, and to bring fluidity to these axes in the same way a weight or width axis brings fluidity to weight and width, respectively. Amstelvar illustrates both a wide range of widths and weights and  axes within the type to control specific details of the letters, and/or the white space the letters enclose and occupy.

Variable fonts also allow the type developer to go beyond the registered axes into any number of stylistic variations. Decovar illustrates this with a wide range of stylistic changes; users can “go fish” for a style that suits the tone of voice they may wish to present. The names and ranges of these axes are as open as the creative process. 

