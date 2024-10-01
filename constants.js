// background colors
// maybe add this color value consts to another color.js separate file.
const background_color = "whitesmoke"; // "#e4e4e4";
const lightOther = "#d4d4d4"
const darkBackground = "#999999"
const background_model_color = "#e4f2e3"
const line_color = "#6b6b6b";
const strength_difference_color = "#dad7cd";
const nucleotide_color = "black";

const veryLightBlue = "#E3EAF9";
const veryLightRed = "#F9E3E3";
const veryStrongBlue = "#a1bfff";
const veryStrongRed = "#f79897";
// // org colors
const inclusion_color = "#c5d6fb";
const inclusion_highlight_color = "#669aff";
const skipping_color = "#f6c3c2";
const skipping_highlight_color = "#ff6666";
//alternative colors
const ltr_inclusion_color = "#B2DAEF";
const ltr_skipping_color = "#F9C4D2";
const ltr_inclusion_highlight_color = "#3BBAE2";
const ltr_skipping_highlight_color = "#F16A92";

// Define the image arrays, each with a unique feature identifier
const imagesData = {
  inclusion: [
    { url: "resources/transparent/incl_1.png", feature: "incl_1" },
    { url: "resources/transparent/incl_2.png", feature: "incl_2" },
    { url: "resources/transparent/incl_3.png", feature: "incl_3" },
    { url: "resources/transparent/incl_4.png", feature: "incl_4" },
    { url: "resources/transparent/incl_5.png", feature: "incl_5" },
    { url: "resources/transparent/incl_6.png", feature: "incl_6" },
    { url: "resources/transparent/incl_7.png", feature: "incl_7" },
  ],
  skipping: [
    { url: "resources/transparent/skip_1.png", feature: "skip_1" },
    { url: "resources/transparent/skip_2.png", feature: "skip_2" },
    { url: "resources/transparent/skip_3.png", feature: "skip_3" },
    { url: "resources/transparent/skip_4.png", feature: "skip_4" },
    { url: "resources/transparent/skip_5.png", feature: "skip_5" },
    { url: "resources/transparent/skip_6.png", feature: "skip_6" },
  ],
  longSkipping: [
    { url: "resources/transparent/skip_g_poor.png", feature: "skip_struct_1" },
    { url: "resources/transparent/skip_stem_loop.png", feature: "skip_struct_2" },
    // { url: "static/transparent/skip_struct_4.png", feature: "skip_struct_4" }
  ]
};

const newImagesData = {
  inclusion: [
    { url: "resources/transparent/incl_1.png", feature: "incl_1" },
    { url: "resources/transparent/incl_2.png", feature: "incl_2" },
    { url: "resources/transparent/incl_3.png", feature: "incl_3" },
    { url: "resources/transparent/incl_4.png", feature: "incl_4" },
    { url: "resources/transparent/incl_5.png", feature: "incl_5" },
    { url: "resources/transparent/incl_6.png", feature: "incl_6" },
    { url: "resources/transparent/incl_7.png", feature: "incl_7" },
    { url: "resources/transparent/incl_8.png", feature: "incl_8" },
    { url: "resources/transparent/incl_9.png", feature: "incl_9" },
  ],
  skipping: [
    { url: "resources/transparent/skip_1.png", feature: "skip_1" },
    { url: "resources/transparent/skip_2.png", feature: "skip_2" },
    { url: "resources/transparent/skip_3.png", feature: "skip_3" },
    { url: "resources/transparent/skip_4.png", feature: "skip_4" },
    { url: "resources/transparent/skip_5.png", feature: "skip_5" },
    { url: "resources/transparent/skip_6.png", feature: "skip_6" },
    { url: "resources/transparent/skip_7.png", feature: "skip_7" },
    { url: "resources/transparent/skip_8.png", feature: "skip_8" },
    { url: "resources/transparent/skip_9.png", feature: "skip_9" },
  ],
  longSkipping: [
    { url: "resources/transparent/skip_g_poor.png", feature: "skip_struct_1" },
    { url: "resources/transparent/skip_stem_loop.png", feature: "skip_struct_2" },
    // { url: "resources/transparent/skip_struct_4.png", feature: "skip_struct_4" }
  ]
};
