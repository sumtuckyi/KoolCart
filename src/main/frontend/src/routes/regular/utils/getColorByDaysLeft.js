const getColorByDaysLeft = (daysLeft) => {
  if (daysLeft >= 0 && daysLeft <= 7) {
    return "#ff0000"; // 빨간색
  }
  //   } else if (daysLeft >= 8 && daysLeft <= 14) {
  //     return "#ffa500"; // 주황색
  //   } else {
  //     return "#008000"; // 초록색
  //   }
};

export default getColorByDaysLeft;
