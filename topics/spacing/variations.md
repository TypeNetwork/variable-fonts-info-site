---
layout: article
breadcrumbs: ["Spacing", "With variables…"]
sidebar: "Responsive spacing"
title: "Responsive spacing"
---

There are two direct advantages, and two indirect advantages, to using variable fonts in the spacing options possible with this technology. The first relates to the optical-size axis and to the trust that can develop between the type designer and the typographer that the spacing of variable fonts along such an axis is as close as possible to ideal for readers. The second advantage comes into play when this ideal is pressured by the user’s conditions or the conditions of composition. Fluid variable suggestions in small or large increments of space are possible, unnoticed, as responsive changes for local composition.

{% capture css %}
    figure#twos-complement {
        background: #f0f0f0;
        padding: 1rem;
        
        > figcaption {
            margin-bottom: 0;
        }

        figure {
            display: block;
            width: 3in;
            max-width: 33vw;
            margin: 0 auto;
            padding: 1rem;
            background: white;

            figcaption {
                font-size: 0.8rem;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                line-height: 1.2;
                margin-top: 0;
            }
        }
        
        .horizontal-stretch, .vertical-stretch {
            font-family: "{{site.data.fonts.names["Amstelvar-Alpha"]}}";
            display: block;
            font-size: 12vw;
            position: relative;
            padding-top: 0;

            @media (min-width: 9in) {
                font-size: 1.2in;
            }
            
            samp {
                font-family: inherit;
                display: block;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                line-height: 1;
                
                &.regular {
                    position: relative;
                    color: #CCC;
                }
                
                + samp {
                    color: #999;
                    + samp {
                        color: #333;
                    }
                }
                
            }
        }

        .horizontal-stretch {
            .regular {
                transform: scaleX(1.0);
            }

            .thin {
                transform: scaleX(0.9);
            }
            
            .thinner {
                transform: scaleX(0.8);
            }
        }
        
        .vertical-stretch {
            .regular {
                transform: scaleY(1.2);
            }

            .squat {
                transform: scaleY(1.0);
            }
            
            .squatter {
                transform: scaleY(0.8);
            }
        }
    }
{% endcapture %}

<style>{{css|scssify}}</style>

<figure id='twos-complement'>
    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-5.svg" alt="Inside-of-letters spacing">
        <figcaption>Inside-of-letters spacing</figcaption>
    </figure>

    <figure class='horizontal-stretch'>
        <samp class='regular'>Two</samp>
        <samp class='thin'>Two</samp>
        <samp class='thinner'>Two</samp>
        <figcaption>Horizontal scale</figcaption>
    </figure>

    <figure class='vertical-stretch'>
        <samp class='regular'>Two</samp>
        <samp class='squat'>Two</samp>
        <samp class='squatter'>Two</samp>
        <figcaption>Vertical scale</figcaption>
    </figure>
    
    <figcaption>
        Variable fonts allow typography access to both the vertical and horizontal white space inside of letters.
    </figcaption>
</figure>

A third, even more indirect advantage is having variable typeface families with parametric values that compute perfectly interoperably with the values of linespacing, kerning, and letterspacing, something the current font format does not contain. The final typographic difference is that the inclusion of an axis that affects width, like a traditional width axis (<strong>wdth</strong>), draws the internal islands of white space out of the insides of glyphs, or a series of styles, into a fluid range good for several purposes.

And finally, in addition to the aforementioned advantages, the web provides typographers with a blank typographic slate, using only the data from the font. While doing typographers no favors, this also puts all of the details of spacing the fonts they choose into their hands. Everything is manual; nothing is automatic.
