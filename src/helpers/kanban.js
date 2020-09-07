export const getListIndex = (data, id) => {
  return data && id ? data.findIndex(list => list.id === id) : -1;
};

export const getCardIndex = (data, id) => {
  return data && id ? data.findIndex(list => list.id === id) : -1;
};

export const getList = (data, id) => {
  return data.find(list => list.id === id);
};

// for reordering in same listId
export const reorder = (data,list,startIndex,endIndex) => {
  if (list) {
    const itemIndex = getListIndex(data, list.id);
    const result = list.items;
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);
    data[itemIndex].items = result;
  }

  return data;
};

// for moving in different listId
export const move = (data,source,destination,droppableSource,droppableDestination) => {
  if (source && destination) {
    const sourceIndex = getListIndex(data, source.id);
    const sourceClone = source.items;
    // console.log("sourceClone===>", sourceClone)
    const destIndex = getListIndex(data, destination.id);
    const destClone = destination.items;
    // console.log("DestClone===>", destClone)
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    // console.log("removed===>", removed)
    destClone.splice(droppableDestination.index, 0, removed);
    
    //Updating items array of source & destination list
    data[sourceIndex].items = sourceClone;
    data[destIndex].items = destClone;
  }
  return data;
};
