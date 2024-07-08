// variable for turning the button on and off.
let defaultSetting = "off";
// toggle outline

// check for toggle state before refreshing



// setting dropdown

// event for when the screen is resized and we need to re-render the graphs in the page again

document.addEventListener('DOMContentLoaded', function() {
  featureSelection(featureSelected = null, className = null)
  PSIview(Data); // Redraw the graph with the same data
  hierarchicalBarChart(Data, Data.feature_activations)
  nucleotideView(Data.sequence, Data.structs, Data.nucleotide_activations)
  // hierarchicalBarChart2(featuresParent, featuresChildren)
  // hierarchicalBarChart3(positionsParent, positionsChildren)
});

// document.addEventListener("DOMContentLoaded", async function () {
//   const selectElement = document.getElementById("option");
//   const dateset = document.getElementById('dataset').value;

//   let selectedOption = localStorage.getItem("selectedOption");

//   if (!selectedOption) {
//     selectedOption = 'exon_s1'; // Default to 'teaser' if nothing in storage
//     localStorage.setItem("selectedOption", selectedOption);
//   }

//   selectElement.value = selectedOption;
//   await fetchData(selectedOption,dateset); // Fetch data immediately on load

//   selectElement.addEventListener("change", async function () {
//     const selectedValue = selectElement.value;
//     localStorage.setItem("selectedOption", selectedValue);
//     await fetchData(selectedValue);
//   });
// });





// document.addEventListener('DOMContentLoaded', function () {
//   const featureView2 = document.querySelector('.feature-view-2');
//   const featureView3 = document.querySelector('.feature-view-3');

//   featureView2.addEventListener('graphRendered', function (event) {
//     // This will be triggered once the graph is rendered
//     const placeholder = event.detail.view.querySelector('.placeholder');
//     if (placeholder) {
//       placeholder.style.display = 'none'; // Hide placeholder
//     }
//   });

//   featureView3.addEventListener('graphRendered', function (event) {
//     // This will be triggered once the graph is rendered
//     const placeholder2 = event.detail.view.querySelector('.placeholder2');
//     if (placeholder2) {
//       placeholder2.style.display = 'none'; // Hide placeholder
//     }
//   });
// });



