// https://lbs.qq.com/tool/getpoint/get-point.html

var isPointInPolygon = function (point, pts) {
  var N = pts.length;  //pts [{lat:xxx,lng:xxx},{lat:xxx,lng:xxx}]
  var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
  var intersectCount = 0;//cross points count of x
  var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
  var p1, p2;//neighbour bound vertices
  var p = point; //point {lat:xxx,lng:xxx}

  p1 = pts[0];//left vertex
  for (var i = 1; i <= N; ++i) {//check all rays
    if ((p.lat == p1.lat) && (p.lng == p1.lng)) {
      return boundOrVertex;//p is an vertex
    }
    p2 = pts[i % N];//right vertex
    if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {//ray is outside of our interests
      p1 = p2;
      continue;//next ray left point
    }
    if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {//ray is crossing over by the algorithm (common part of)
      if (p.lng <= Math.max(p1.lng, p2.lng)) {//x is before of ray
        if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {//overlies on a horizontal ray
          return boundOrVertex;
        }
        if (p1.lng == p2.lng) {//ray is vertical
          if (p1.lng == p.lng) {//overlies on a vertical ray
            return boundOrVertex;
          } else {//before ray
            ++intersectCount;
          }
        } else {//cross point on the left side
          var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng
          if (Math.abs(p.lng - xinters) < precision) {//overlies on a ray
            return boundOrVertex;
          }
          if (p.lng < xinters) {//before ray
            ++intersectCount;
          }
        }
      }
    } else {//special case when ray is crossing through the vertex
      if (p.lat == p2.lat && p.lng <= p2.lng) {//p crossing over p2
        var p3 = pts[(i + 1) % N]; //next vertex
        if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {//p.lat lies between p1.lat & p3.lat
          ++intersectCount;
        } else {
          intersectCount += 2;
        }
      }
    }
    p1 = p2;//next ray left point
  }
  if (intersectCount % 2 == 0) {//偶数在多边形外
    return false;
  } else { //奇数在多边形内
    return true;
  }
};

// 多边形的点是有顺序的 连续的 不能跳跃
const RingData = {
  zhengzhou: {
    three: [
      // 最左上角
      { lat: 34.809857, lng: 113.597946 },
      // 最右上角
      { lat: 34.799709, lng: 113.780937 },
      // 最右下角
      { lat: 34.704082, lng: 113.777504 },
      // 最左下角 靠右下
      { lat: 34.699848, lng: 113.619576 },
      // 最左下角 靠左上
      { lat: 34.731738, lng: 113.585243 },
    ],
    four: [
      { lat: 34.887057, lng: 113.529625 }, // 左上
      { lat: 34.851566, lng: 113.816299 }, // 又上
      { lat: 34.710574, lng: 113.812180 }, // 右下
      { lat: 34.663711, lng: 113.606873 }, // 左下 下
      { lat: 34.698719, lng: 113.594513 }, // 坐下 中
      { lat: 34.696743, lng: 113.540955 }, // 左下 左
    ],
  }
}

var isPointInZhengZhouRingX = function (point) {
  // 先判断是否在3环内 如果在3环内 则一定在4环内
  if (isPointInPolygon(point, RingData.zhengzhou.three)) {
    return 3
  }
  // 再判断是否在4环内
  if (isPointInPolygon(point, RingData.zhengzhou.four)) {
    return 4
  }
  return 9;
}

// below are test cases
// delete below in production
console.log("below is 3 ring test")
var point1 = { lat: 34.755717, lng: 113.750038 }
var point2 = { lat: 34.704929, lng: 113.590736 }
var point3 = { lat: 34.714242, lng: 113.609962 }

console.log(isPointInZhengZhouRingX(point1))
console.log(isPointInZhengZhouRingX(point2))
console.log(isPointInZhengZhouRingX(point3))

console.log("below is 4 ring test")

var point4 = { lat: 34.685169, lng: 113.580093 }
var point5 = { lat: 34.721297, lng: 113.562241 }
console.log(isPointInZhengZhouRingX(point4))
console.log(isPointInZhengZhouRingX(point5))

