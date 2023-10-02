/**
 * @param {Array} details List of details to be converted.
 * @returns {Object} Theme tree object suitable for beign used with tree components.
 */
export default function detailListToTree(details) {
  let tree = {}
  details.forEach(d => {
    // Add area
    if (!tree[d.element.area.id]) {
      tree[d.element.area.id] = {
        ...d.element.area,
        elements: {},
      }
    }
    // Add element
    if (!tree[d.element.area.id].elements[d.element.id]) {
      tree[d.element.area.id].elements[d.element.id] = {
        ...d.element,
        details: {},
      }
    }
    tree[d.element.area.id].elements[d.element.id].details[d.id] = d
  })
  return tree
}
