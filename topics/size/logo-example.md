---
layout: article
breadcrumbs: ["Size", "Examples"]
sidebar: "Logo sizing"
title: "Logo sizing"
---

A company called MOSCOSO needs a new logotype, which they want to be in all caps. They seek something “narrower, bolder, and more elegant” than their reference serif. The logo will be used at three sizes: full size (display), half size, and quarter size.

The designer finds a suitable “narrow, bold, and elegant” serif to use as a starting point. Houston, we have a problem: at smaller sizes, the finer details of this font start to disappear.

{% include inline-example.html example='size/logo-3' %}

In the absence of designed optical sizes for this family, a common reaction
might be to redesign the logotype using a “sturdier” typeface, like a flavorless sans, that can survive
being displayed at smaller sizes.

{% include inline-example.html example='size/logo-4' %}

With variable fonts, smaller sizes can be tuned to preserve the more delicate features of the design
without compromising the elegance of the display version. Through CSS or application math,
these tweaks can scale as the font changes size.

{% include inline-example.html example='size/logo-5' %}
