function getDeterminantArrays(data) {
  let detArray1 = [
    data[1][1],
    data[1][2],
    data[1][3],
    data[2][1],
    data[2][2],
    data[2][3],
    data[3][1],
    data[3][2],
    data[3][3],
  ];

  let detArray2 = [
    data[1][0],
    data[1][2],
    data[1][3],
    data[2][0],
    data[2][2],
    data[2][3],
    data[3][0],
    data[3][2],
    data[3][3],
  ];

  let detArray3 = [
    data[1][0],
    data[1][1],
    data[1][3],
    data[2][0],
    data[2][1],
    data[2][3],
    data[3][0],
    data[3][1],
    data[3][3],
  ];

  let detArray4 = [
    data[1][0],
    data[1][1],
    data[1][2],
    data[2][0],
    data[2][1],
    data[2][2],
    data[3][0],
    data[3][1],
    data[3][2],
  ];

  let detArray5 = [
    data[0][1],
    data[0][2],
    data[0][3],
    data[2][1],
    data[2][2],
    data[2][3],
    data[3][1],
    data[3][2],
    data[3][3],
  ];

  let detArray6 = [
    data[0][0],
    data[0][2],
    data[0][3],
    data[2][0],
    data[2][2],
    data[2][3],
    data[3][0],
    data[3][2],
    data[3][3],
  ];

  let detArray7 = [
    data[0][0],
    data[0][1],
    data[0][3],
    data[2][0],
    data[2][1],
    data[2][3],
    data[3][0],
    data[3][1],
    data[3][3],
  ];

  let detArray8 = [
    data[0][0],
    data[0][1],
    data[0][2],
    data[2][0],
    data[2][1],
    data[2][2],
    data[3][0],
    data[3][1],
    data[3][2],
  ];

  let detArray9 = [
    data[0][1],
    data[0][2],
    data[0][3],
    data[1][1],
    data[1][2],
    data[1][3],
    data[3][1],
    data[3][2],
    data[3][3],
  ];

  let detArray10 = [
    data[0][0],
    data[0][2],
    data[0][3],
    data[1][0],
    data[1][2],
    data[1][3],
    data[3][0],
    data[3][2],
    data[3][3],
  ];

  let detArray11 = [
    data[0][0],
    data[0][1],
    data[0][3],
    data[1][0],
    data[1][1],
    data[1][3],
    data[3][0],
    data[3][1],
    data[3][3],
  ];

  let detArray12 = [
    data[0][0],
    data[0][1],
    data[0][2],
    data[1][0],
    data[1][1],
    data[1][2],
    data[3][0],
    data[3][1],
    data[3][2],
  ];

  let detArray13 = [
    data[0][1],
    data[0][2],
    data[0][3],
    data[1][1],
    data[1][2],
    data[1][3],
    data[2][1],
    data[2][2],
    data[2][3],
  ];

  let detArray14 = [
    data[0][0],
    data[0][2],
    data[0][3],
    data[1][0],
    data[1][2],
    data[1][3],
    data[2][0],
    data[2][2],
    data[2][3],
  ];

  let detArray15 = [
    data[0][0],
    data[0][1],
    data[0][3],
    data[1][0],
    data[1][1],
    data[1][3],
    data[2][0],
    data[2][1],
    data[2][3],
  ];

  let detArray16 = [
    data[0][0],
    data[0][1],
    data[0][2],
    data[1][0],
    data[1][1],
    data[1][2],
    data[2][0],
    data[2][1],
    data[2][2],
  ];

  return [
    detArray1,
    detArray2,
    detArray3,
    detArray4,
    detArray5,
    detArray6,
    detArray7,
    detArray8,
    detArray9,
    detArray10,
    detArray11,
    detArray12,
    detArray13,
    detArray14,
    detArray15,
    detArray16,
  ];
}

// test data : var data = [
//   { x: -1, y: -5 },
//   { x: -0.33, y: -0.11 },
//   { x: 0, y: -1 },
//   { x: 0.53, y: -4.98 },
//   { x: 2, y: -12 },
//   { x: 2.7, y: 0 },
// ];
