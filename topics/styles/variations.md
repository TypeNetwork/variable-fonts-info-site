---
layout: article
breadcrumbs: ["Styles", "With variables…"]
sidebar: "Styles, meet instances"
title: "Styles, meet instances"
---
A variable font contains a minimum of one axis, which typically provides a fluid range of styles that are visually congruent to a central design (the “default variable”). Such a font might just contain a weight axis (**wght**) or, like many font families today, it might include styles of weight and width in various combinations. The total combinations of axes define a style range referred to as the “design space” of a font family with—in contrast to the old discrete styles—instances* found at every combination of the ranges of each axis. **(Fig 01)**

Replacing existing font families with variable-font families means that the variable font can contain the regular design as the default. If the original styles are all weights, the font can contain these as named instances along the **wght** axis, allowing the styles to show in menus, matching preexisting styles from a variable font’s design space. 

Another variable-font file would contain widths and weights in the same way, while offering all of the combinations of all of the weights and all of the widths as well. This may sometimes enlarge the design space of an existing font family to cover more styles than the original. **(Fig 02)**

Variable fonts also allow the type developer to go beyond the registered axes, and into any number of stylistic or technical variations. Decovar illustrates the former, with a wide range of stylistic changes; users can “go fish” for a style that suits the tone of voice they may wish to present. The names and ranges of these kind of stylistic variations are as open as the creative process. **(Fig 03)**

The font specification also contains an axis that is new to desktop and web software: optical size (**opsz**). **(Fig 04)**
Combined with weight and width, an optical size axis adds the capability to define weight and width ranges in a variable font's design space to work best for any font family, with wider ranges of both weight and width for greater impact and more efficient use of space in large sizes, and "safer" ranges of both weight and width in small sizes where type is more vulnerable to print production and web text rendering.  

The italic or slant axes (**ital** and **slnt**, can also be added to a design space to bring wiughts, widths, and optical sizes to a family of upright and not so upriight styles. No other registered axes exists, i.e. axes definitions written into the specification of Opentype 1.8, but variable fonts can contain numerous  custom (unregistered) axes, and variation to styles in a design space that are also new or unfamiliar to users. 

For example, in Amstelvar, Font Bureau added axes to adjust for the technical requirements of both composition and output, and to bring fluidity to these axes in the same way a **wght** or **wdth** axis brings fluidity to weight and width, respectively. Amstelvar illustrates both the former and the latter: fishing capabilities, with a wide range of widths and weights. But the user can also “go figure,” using parametric values—measures within the type—to control specific details of the letters, and/or the white space the letters enclose and occupy.

That takes us back to some basics about variations, beginning with the recognition that the default font is a particular combination of values. In Amstelvar’s case, for example, that makes a regular weight and width of the family readable at 12pt. So the default, and each style on the weight axis, is a combination of width and weight changes, and a little x-height change for that particular size.  
