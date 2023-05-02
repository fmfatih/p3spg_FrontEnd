const formatPhoneNumber = (text: string) => {
  let newVal: string = '';
  if (text && text.length > 7) {
    newVal = text.slice(0, 2) + ') ' + text.slice(2);
    newVal = newVal.slice(0, 7) + ' ' + newVal.slice(7);
    newVal = newVal.slice(0, 10) + ' ' + newVal.slice(10);
  } else if (text && text.length > 5) {
    newVal = text.slice(0, 2) + ') ' + text.slice(2);
    newVal = newVal.slice(0, 7) + ' ' + newVal.slice(7);
  } else if (text && text.length > 2) {
    newVal = text.slice(0, 2) + ') ' + text.slice(2);
  } else {
    newVal = text;
  }
  return newVal;
};

const formatContactNumber = (text: string) => {
  let newVal: string = '';
  newVal = '0(' + text.slice(0, 3) + ') ' + text.slice(3);
  newVal = newVal.slice(0, 10) + ' ' + newVal.slice(10);
  newVal = newVal.slice(0, 13) + ' ' + newVal.slice(13);

  return newVal;
};

const formatIban = (text: string) => {
  let newVal: string = '';
  if (!text) {
    return;
  }
  if (text && text.length > 26) {
    newVal =
      text.slice(0, 2) +
      ' ' +
      text.slice(2, 6) +
      ' ' +
      text.slice(6, 10) +
      ' ' +
      text.slice(10, 14) +
      ' ' +
      text.slice(14, 18) +
      ' ' +
      text.slice(18, 22) +
      ' ' +
      text.slice(22, 26) +
      ' ' + text.slice(26);
  } else if (text && text.length > 22) {
    newVal =
      text.slice(0, 2) +
      ' ' +
      text.slice(2, 6) +
      ' ' +
      text.slice(6, 10) +
      ' ' +
      text.slice(10, 14) +
      ' ' +
      text.slice(14, 18) +
      ' ' +
      text.slice(18, 22) +
      ' ' +
      text.slice(22);
  } else if (text && text.length > 18) {
    newVal =
      text.slice(0, 2) +
      ' ' +
      text.slice(2, 6) +
      ' ' +
      text.slice(6, 10) +
      ' ' +
      text.slice(10, 14) +
      ' ' +
      text.slice(14, 18) +
      ' ' +
      text.slice(18);
  } else if (text && text.length > 14) {
    newVal =
      text.slice(0, 2) +
      ' ' +
      text.slice(2, 6) +
      ' ' +
      text.slice(6, 10) +
      ' ' +
      text.slice(10, 14) +
      ' ' +
      text.slice(14);
  } else if (text && text.length > 10) {
    newVal =
      text.slice(0, 2) +
      ' ' +
      text.slice(2, 6) +
      ' ' +
      text.slice(6, 10) +
      ' ' +
      text.slice(10);
  } else if (text && text.length > 6) {
    newVal = text.slice(0, 2) + ' ' + text.slice(2, 6) + ' ' + text.slice(6);
  } else if (text && text.length > 2) {
    newVal = text.slice(0, 2) + ' ' + text.slice(2);
  } else {
    newVal = text;
  }
  return newVal;
};

export {
  formatPhoneNumber,
  formatContactNumber,
  formatIban,
};
