var noiseWidth = 512;
var noiseHeight = 512;

function perlin2D(bias){
   var samples = 1;
   var result = [];
   var sum = 0;
   //filling result by 0s, so i can += in the main part
   for(var i=0; i<noiseWidth; i++){
      result[i] = [];
      for(var j=0; j<noiseHeight; j++){
         result[i][j] = 0;
      }
   }

   var randomArray = [];
   var interpolMap = [];

   for(var i=0; i<noiseWidth*noiseHeight; i++){
      randomArray.push(genrand_real1());
   }

   var scaling = 1;

   while (samples < noiseWidth) {
      var offset = noiseWidth/samples;

      //interpolating between the points
      for(var i=0; i<noiseWidth; i++){
         for(var j=0; j<noiseHeight; j++){
            /*
            var x1, x2, y1, y2;
            x1 = randomArrayX[Math.floor(i/offset)*offset];
            y1 = randomArrayY[Math.floor(j/offset)*offset];

            if(i >= noiseWidth - offset)
            x2 = randomArrayX[0];
            else
            x2 = randomArrayX[Math.floor(i/offset)*offset + offset];

            if(j >= noiseWidth - offset)
            y2 = randomArrayY[0];
            else
            y2 = randomArrayY[Math.floor(j/offset)*offset + offset];

            var interpol1 = interpolation(offset, x1, x2, i%offset)
            var interpol2 = interpolation(offset, y1, y2, j%offset)
            result[i][j] += interpolation(1, interpol1, interpol2, 0.5)*(1/samples);
            */
            var pitch = noiseWidth/samples
            var x1 = Math.floor(i/pitch) * pitch;
            var y1 = Math.floor(j/pitch) * pitch;

            var x2 = Math.floor(x1 + pitch) % noiseWidth;
            var y2 = Math.floor(y1 + pitch) % noiseHeight;

            var blendX = (i - x1) / pitch;
            var blendY = (j - y1) / pitch;

            var sampleT = (1-blendX) * randomArray[y1*noiseWidth + x1] + blendX * randomArray[y1 * noiseWidth + x2];
            var sampleB = (1-blendX) * randomArray[y2*noiseWidth + x1] + blendX * randomArray[y2 * noiseWidth + x2];

            result[i][j] += (blendY * (sampleB - sampleT) + sampleT) * scaling;
         }
      }
      sum += 1*scaling;
      scaling /= bias

      samples <<= 1;
   }
   //after creating the values, i must squish them down to a value between 0 and 1
   for(var i=0; i<noiseWidth; i++){
      for(var j=0; j<noiseHeight; j++){
         result[i][j] /= sum;
      }
   }

   return result;
}

//distance is the length between the two points x1 and x2
//x1 and x2 are the points i will interpolate between
//pointDistance is the distance from the point to x1
function interpolation(distance, x1, x2, pointDistance){
   return x1*((distance-pointDistance)/distance) + x2*(pointDistance/distance)
}
