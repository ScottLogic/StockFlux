export default function(title, careted, listIcons, icon) {
  return {
    title: title || null,
    careted: careted || false,
    listIcons: listIcons || false,
    icon: icon || false
  };
}
