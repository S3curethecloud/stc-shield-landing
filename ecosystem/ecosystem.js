const nodes = document.querySelectorAll(".flow-node");
let index = 0;

function cycleNodes() {
  nodes.forEach(node => node.classList.remove("active"));
  nodes[index].classList.add("active");
  index = (index + 1) % nodes.length;
}

setInterval(cycleNodes, 2000);
cycleNodes();
