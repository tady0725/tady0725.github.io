

async function init(){
    model= await tf.loadLayersModel('./models/model.json');
    console.log('load model...');
}


function submit(){
    const selectFile = document.getElementById('input').files[0];
    console.log(selectFile);
    let reader = new FileReader();
    reader.onload = e =>{
        let img =document.createElement('img');
        img.src= e.target.result;
        img.width=144;
        img.height=144;
        img.onload=()=>{
            const showImage=document.getElementById('showImage');
            showImage.innerHTML='';
            showImage.appendChild(img);
            predict(img);
        }
    }
    reader.readAsDataURL(selectFile);
}

function findMaxIndex(result){
    const arr = Array.from(result);
    let maxIndex=0;
    let maxValue=0;
    for(let i=0;i<arr.length;i++){
      if(arr[i]>maxValue){
        maxIndex=i;
        maxValue=arr[i]
      }
    }
    return {predNum: maxIndex, prob: maxValue};
  }

function predict(imgElement){
    // 將 HTML <img> 轉換成轉換為矩陣 tensor
    const tfImg = tf.browser.fromPixels(imgElement, 1);
    // 強制將圖片縮小到 28*28 像素
    const smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
    // 將 tensor 設為浮點型態，且將張量攤平至四維矩陣。此時 shape 為 [1, 28,28,1]
    let tensor = smalImg.reshape([1, 28,28,1]);
    // 將所有數值除以255 正歸化 +
    tensor=tensor.div(tf.scalar(255));
    // 預測 

    const pred = model.predict(tensor);
    const result = pred.dataSync();
    // 取得 one hot encoding 陣列中最大的索引
    const {predNum, prob} = findMaxIndex(result);
    console.log(predNum, prob);
    document.getElementById('resultValue').innerHTML=predNum;

}