// 颜色配置（统一管理）
let COLORS = {
    hour: '0,137,168',    // 近似 #2489A8
    second: '98,153,140',  // 近似 #5F998C
    minute: '96,86,150',   // 近似 #605696
    secFill: '118,44,44',  // 近似 #762c2c (备用)
    hourFill: '72,118,44',  // 近似 #48762c (备用)
    white: '255,255,255',
    black: '0,0,0'
};

function rgbaCol(keyOrR, a) {
    // 支持传入颜色 key（如 'hour'）或直接传入 "r,g,b" 字符串
    const rgb = COLORS[keyOrR] || keyOrR;
    return `rgba(${rgb}, ${a})`;
}

// 计算响应式字体大小
function calculateFontSize() {
    // 基于屏幕较小的一边计算字体大小
    const baseSize = Math.min(window.innerWidth, window.innerHeight);
    // 字体大小为屏幕尺寸的 2.4%
    return Math.round(baseSize * 0.038);
}

// 计算文字和刻度的间距
function calculateTextGap() {
    // 基于屏幕较小的一边计算间距
    const baseSize = Math.min(window.innerWidth, window.innerHeight);
    // 间距为屏幕尺寸的 1.5%
    return Math.round(baseSize * 0.020);
}
function font_control(){
    const fontSize = calculateFontSize();
    const fontfamily = 'Comic Sans MS';
    const fontWeight = 'bold';
    // 调整字宽
    return `${fontSize}px ${fontfamily} ${fontWeight}`;

}
function init_canvas() {
    // 从wallpaper engine获取颜色配置
    second_canvas = document.getElementById('second-canvas');
    second_canvas.width = window.innerWidth;
    second_canvas.height = window.innerHeight;
    second_canvas.style.width = 100 + 'vw';
    second_canvas.style.height = 100 + 'vh';
    second_canvas_ctx = second_canvas.getContext('2d');
    // 初始化min画布
    min_canvas = document.getElementById('min-canvas');
    min_canvas.width = window.innerWidth;
    min_canvas.height = window.innerHeight;
    min_canvas.style.width = 100 + 'vw';
    min_canvas.style.height = 100 + 'vh';
    min_canvas.style.opacity = 1;
    //hour
    hour_canvas = document.getElementById('hour-canvas');
    hour_canvas.width = window.innerWidth;
    hour_canvas.height = window.innerHeight;
    hour_canvas.style.width = 100 + 'vw';
    hour_canvas.style.height = 100 + 'vh';

    

}
function draw_sec_watchface(sec = 0, ratio = 1) {
    const r = Math.min(window.innerWidth, window.innerHeight) * 0.45;
    const r_remove = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const tick_length=Math.min(window.innerWidth, window.innerHeight)* 0.02;
    second_canvas_ctx.clearRect(0, 0, second_canvas.width, second_canvas.height);
    // 计算圆心位置
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    // 偏移圆心点
    // 圆周运动的半径
    const orbitRadius = 1000 * ratio;
    // 根据秒数计算角度 (0秒在12点方向,顺时针旋转)
    const angle = (sec / 60) * 2 * Math.PI - Math.PI / 2;
    // 计算偏移量
    let offsetX = Math.cos(angle) * orbitRadius;
    let offsetY = Math.sin(angle) * orbitRadius;
    // 应用偏移
    centerX -= offsetX;
    centerY -= offsetY;
    // 画圆心点
    // second_canvas_ctx.beginPath();
    // second_canvas_ctx.arc(centerX, centerY, ratio * 1000 + r, 0, 2 * Math.PI);
    // second_canvas_ctx.fillStyle = '#f9f9f9';
    // second_canvas_ctx.fill();
    // 挖掉一块圆
    second_canvas_ctx.globalCompositeOperation = 'destination-out';
    second_canvas_ctx.beginPath();
    second_canvas_ctx.arc(centerX, centerY, r_remove+ratio * 1000, 0, 2 * Math.PI);
    second_canvas_ctx.fill();
    second_canvas_ctx.globalCompositeOperation = 'source-over';
    // 画时间刻度
    for (let i = 0; i < 600; i += 1) {
        const tickAngle = (i / 600) * 2 * Math.PI - Math.PI / 2;
        const tickRadius = ratio * 1000 + r;
        let tickLength;
        let opacity=1;
        let lineWid=3;
        if (i % 50 === 0) {
            tickLength = tick_length*1.3*(ratio+1); // 每1秒一个长刻度
        } else if (i % 10 === 0) {
            tickLength = tick_length*0.8*(ratio+1);
        } else {
            tickLength = tick_length;
            opacity = ratio;
            lineWid=1;
        }
        
        const startX = centerX + Math.cos(tickAngle) * tickRadius;
        const startY = centerY + Math.sin(tickAngle) * tickRadius;
        const endX = centerX + Math.cos(tickAngle) * (tickRadius - tickLength);
        const endY = centerY + Math.sin(tickAngle) * (tickRadius - tickLength);
    second_canvas_ctx.beginPath();
    second_canvas_ctx.moveTo(startX, startY);
    second_canvas_ctx.lineTo(endX, endY);
    // #5F998C 
    second_canvas_ctx.strokeStyle = rgbaCol('second', opacity);
    second_canvas_ctx.lineWidth = lineWid;
    second_canvas_ctx.stroke();
        // 每秒写出数字
        if (i % 10 === 0) {
            text_opacity=opacity;
            if( i % 50 === 0)
            {
                text_opacity=1;
            }else{
                text_opacity=ratio;
            }
            const textGap = calculateTextGap();
            const numX = centerX + Math.cos(tickAngle) * (tickRadius  - textGap-tick_length*1.5*(ratio+1));
            const numY = centerY + Math.sin(tickAngle) * (tickRadius  - textGap-tick_length*1.5*(ratio+1));
            second_canvas_ctx.font = font_control();
            second_canvas_ctx.fillStyle = rgbaCol('second', text_opacity);
            let number = (i / 10).toString();
            if (number=='0'){
                number='60';
            }else if (number.length==1){
                number='0'+number;
            }
            second_canvas_ctx.save(); // 保存当前状态
            second_canvas_ctx.translate(numX, numY); // 移动到文本位置
            ag=tickAngle + Math.PI / 2
            if(ag>Math.PI/2 && ag<Math.PI*3/2 ){
                ag-=Math.PI;
            }
            second_canvas_ctx.rotate(ag); // 旋转文本
            second_canvas_ctx.fillText(number, -second_canvas_ctx.measureText(number).width / 2, 8); // 绘制文本
            second_canvas_ctx.restore(); // 恢复状态
        }
    }
    draw_time(r);
    // draw_min_watchface(ratio);
}
function draw_min_watchface(ratio = 1) {
    const r = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const r_remove = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    const tick_length = Math.min(window.innerWidth, window.innerHeight) * 0.02;
    const min_ctx = min_canvas.getContext('2d');

    min_ctx.clearRect(0, 0, min_canvas.width, min_canvas.height);
    // 计算圆心位置
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    // 圆周运动的半径
    const orbitRadius = 1000 * ratio;
    // 获取当前分钟、秒和毫秒，实现更平滑的移动
    const now = new Date();
    const minutes = now.getMinutes() + (now.getSeconds() + now.getMilliseconds() / 1000) / 60;
    // 根据分钟计算角度 (0分在12点方向,顺时针旋转)
    const angle = (minutes / 60) * 2 * Math.PI - Math.PI / 2;
    // 计算偏移量
    let offsetX = Math.cos(angle) * orbitRadius;
    let offsetY = Math.sin(angle) * orbitRadius;
    // 应用偏移
    centerX -= offsetX;
    centerY -= offsetY;
    // 画圆心点
    // min_ctx.beginPath();
    // min_ctx.arc(centerX, centerY, ratio * 1000 + r, 0, 2 * Math.PI);
    // min_ctx.fillStyle = '#2c4876ff'; // 使用不同的颜色区分分钟表盘
    // min_ctx.fill();
    // 挖掉一块圆
    min_ctx.globalCompositeOperation = 'destination-out';
    min_ctx.beginPath();
    min_ctx.arc(centerX, centerY, ratio * 1000 +r_remove, 0, 2 * Math.PI);
    min_ctx.fill();
    min_ctx.globalCompositeOperation = 'source-over';
    // 画时间刻度
    for (let i = 0; i < 600; i += 1) {
        const tickAngle = (i / 600) * 2 * Math.PI - Math.PI / 2;
        const tickRadius = ratio * 1000 + r;
        let tickLength;
        let opacity = 1;
        let lineWid = 4;
        if (i % 50 === 0) {
            tickLength = tick_length * 1.5;
        } else if (i % 10 === 0) {
            tickLength = tick_length * 1.2;
        } else {
            tickLength = tick_length;
            opacity = ratio;
            lineWid = 1;
        }
        // 每分钟写出数字
        if (i % 10 === 0) {
            let text_opacity = opacity;
            if (i % 50 === 0) {
                text_opacity = 1;
            } else {
                text_opacity = ratio;
            }
            const textGap = calculateTextGap();
            const numX = centerX + Math.cos(tickAngle) * (tickRadius  - textGap-tick_length*1.5*(ratio+1));
            const numY = centerY + Math.sin(tickAngle) * (tickRadius  - textGap-tick_length*1.5*(ratio+1));
            min_ctx.font = font_control();
            // #605696
            min_ctx.fillStyle = rgbaCol('minute', text_opacity);
            let number = (i / 10).toString();
            if (number == '0') {
                number = '60';
            } else if (number.length == 1) {
                number = '0' + number;
            }
            
            min_ctx.save(); // 保存当前状态
            min_ctx.translate(numX, numY); // 移动到文本位置
            
            let ag = tickAngle + Math.PI / 2;
            if (ag > Math.PI/2 && ag < Math.PI*3/2) {
                ag -= Math.PI; // 翻转文本以保持正确朝向
            }
            min_ctx.rotate(ag); // 旋转文本
            
            min_ctx.fillText(number, -min_ctx.measureText(number).width / 2, 8); // 绘制文本
            min_ctx.restore(); // 恢复状态
        }
        const startX = centerX + Math.cos(tickAngle) * tickRadius;
        const startY = centerY + Math.sin(tickAngle) * tickRadius;
        const endX = centerX + Math.cos(tickAngle) * (tickRadius - tickLength);
        const endY = centerY + Math.sin(tickAngle) * (tickRadius - tickLength);
    min_ctx.beginPath();
    min_ctx.moveTo(startX, startY);
    min_ctx.lineTo(endX, endY);
    min_ctx.strokeStyle = rgbaCol('minute', opacity);
    min_ctx.lineWidth = lineWid;
    min_ctx.stroke();
    }
}
function draw_hour_watchface() {
    hour_canvas= document.getElementById('hour-canvas');
    hour_canvas.width = window.innerWidth;
    hour_canvas.height = window.innerHeight;
    hour_canvas.style.width = 100 + 'vw';
    hour_canvas.style.height = 100 + 'vh';
    const hour_ctx = hour_canvas.getContext('2d');
    hour_ctx.clearRect(0, 0, hour_canvas.width, hour_canvas.height);
    // 不用计算 画固定
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    const r = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    // 画圆心点
    // hour_ctx.beginPath();
    // hour_ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
    // hour_ctx.fillStyle = '#48762cff'; // 使用不同的颜色区分小时表盘
    // hour_ctx.fill();
    for (let i = 0; i < 48; i += 1) {
        const tickAngle = (i / 48) * 2 * Math.PI - Math.PI / 2;
        const tickRadius = r;
        const tickLength = Math.min(window.innerWidth, window.innerHeight) * 0.03;
        let linelen = 0;
        let linewid=4;
        if (i % 4 == 0) {
            linelen = 1;
            linewid = 6;
        }else if(i % 4 == 2){
            linelen = 0.6;
            linewid = 3;
        }
         else {
            linelen = 0.3;
            linewid = 2;
        }
        const startX = centerX + Math.cos(tickAngle) * tickRadius;
        const startY = centerY + Math.sin(tickAngle) * tickRadius;
        const endX = centerX + Math.cos(tickAngle) * (tickRadius - tickLength * linelen);
        const endY = centerY + Math.sin(tickAngle) * (tickRadius - tickLength * linelen);
    hour_ctx.beginPath();
    hour_ctx.moveTo(startX, startY);
    hour_ctx.lineTo(endX, endY);
    // #2489A8
    hour_ctx.strokeStyle = rgbaCol('hour', 1);
    hour_ctx.lineWidth = linewid;
    hour_ctx.stroke();
        // 显示12 3 6 9
        if (i % 12 === 0) {
            const textGap = calculateTextGap();
            const numX = centerX + Math.cos(tickAngle) * (tickRadius - tickLength * linelen - textGap-Math.min(window.innerWidth, window.innerHeight) * 0.02);
            const numY = centerY + Math.sin(tickAngle) * (tickRadius - tickLength * linelen - textGap-Math.min(window.innerWidth, window.innerHeight) * 0.02);
            hour_ctx.font = font_control();
            hour_ctx.fillStyle = rgbaCol('hour', 1);
            let number = (i / 4).toString();
            if (number=='0'){
                number='12';
            }
            // 不用旋转
            hour_ctx.fillText(number, numX - hour_ctx.measureText(number).width / 2, numY + 8); // 绘制文本
            hour_ctx.restore();
        }

    }

}
function draw_time() {
    // 在画布中心位置画秒针
    tick_canvas = document.getElementById('tick');
    tick_canvas.width = window.innerWidth;
    tick_canvas.height = window.innerHeight;
    tick_canvas.style.width = 100 + 'vw';
    tick_canvas.style.height = 100 + 'vh';
    const tick_ctx = tick_canvas.getContext('2d');
    tick_ctx.clearRect(0, 0, tick_canvas.width, tick_canvas.height);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = now.getHours() % 12 + minutes / 60;

    // Convert to angles (0 at 12 o'clock, clockwise)
    const secondAngle = (seconds / 60) * 2 * Math.PI - Math.PI / 2;
    const minuteAngle = (minutes / 60) * 2 * Math.PI - Math.PI / 2;
    const hourAngle = (hours / 12) * 2 * Math.PI - Math.PI / 2;

    // Draw hour hand with capsule shape
    const hourLength = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    let hour_point_x = centerX + Math.cos(hourAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    let hour_point_y = centerY + Math.sin(hourAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    
    // 绘制描边
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(hour_point_x, hour_point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(hourAngle) * hourLength * 0.8,
        centerY + Math.sin(hourAngle) * hourLength * 0.8
    );
    tick_ctx.strokeStyle = rgbaCol('hour', 1);
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.035;
    tick_ctx.stroke();
    
    // 绘制连接到中心的部分
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'butt';
    tick_ctx.moveTo(centerX, centerY);
    tick_ctx.strokeStyle = rgbaCol('hour', 1);
    tick_ctx.lineWidth = 12;
    tick_ctx.lineTo(hour_point_x, hour_point_y);
    tick_ctx.stroke();
    
    // 清除内部区域
    tick_ctx.save();
    tick_ctx.globalCompositeOperation = 'destination-out';
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(hour_point_x, hour_point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(hourAngle) * hourLength * 0.8,
        centerY + Math.sin(hourAngle) * hourLength * 0.8
    );
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.028;
    tick_ctx.stroke();
    tick_ctx.restore();
    
    // 绘制半透明填充
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(hour_point_x, hour_point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(hourAngle) * hourLength * 0.8,
        centerY + Math.sin(hourAngle) * hourLength * 0.8
    );
    tick_ctx.strokeStyle = rgbaCol('hour', 0.5);
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.028;
    tick_ctx.stroke();

    // Draw minute hand
    // Draw minute hand as capsule shape with stroke
    const minuteLength = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const minuteWidth = 6;
    let point_x,point_y;
    point_x=centerX+Math.cos(minuteAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    point_y=centerY+Math.sin(minuteAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    
    // 绘制描边
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(point_x, point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(minuteAngle) * minuteLength*0.8,
        centerY + Math.sin(minuteAngle) * minuteLength*0.8
    );
    tick_ctx.strokeStyle = rgbaCol('minute', 1);
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.025;
    tick_ctx.stroke();
    
    
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'butt';
    tick_ctx.moveTo(centerX, centerY);
    tick_ctx.strokeStyle = rgbaCol('minute', 1);
    tick_ctx.lineWidth = 10;
    tick_ctx.lineTo(
        point_x,
        point_y
    );

    
    tick_ctx.lineWidth =10;
    tick_ctx.stroke();
    // 先清除该区域
    tick_ctx.save();
    tick_ctx.globalCompositeOperation = 'destination-out';
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(point_x, point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(minuteAngle) * minuteLength*0.8,
        centerY + Math.sin(minuteAngle) * minuteLength*0.8
    );
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.020;
    tick_ctx.stroke();
    tick_ctx.restore();
    
    // 绘制半透明填充
    tick_ctx.beginPath();
    tick_ctx.lineCap = 'round';
    tick_ctx.moveTo(point_x, point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(minuteAngle) * minuteLength*0.8,
        centerY + Math.sin(minuteAngle) * minuteLength*0.8
    );
    tick_ctx.strokeStyle = rgbaCol('minute', 0.5);
    tick_ctx.lineWidth = Math.min(window.innerWidth, window.innerHeight) * 0.020;
    tick_ctx.stroke();
    // Draw second hand
    point_x=centerX-Math.cos(secondAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    point_y=centerY-Math.sin(secondAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.05;
    tick_ctx.beginPath();
    tick_ctx.moveTo(point_x, point_y);
    tick_ctx.lineTo(
        centerX + Math.cos(secondAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.45,
        centerY + Math.sin(secondAngle) * Math.min(window.innerWidth, window.innerHeight) * 0.45
    );
    tick_ctx.strokeStyle = rgbaCol('white', 1);
    tick_ctx.lineWidth = 2;
    tick_ctx.stroke();
    // 画中心圆点
    tick_ctx.beginPath();
    tick_ctx.arc(centerX, centerY, Math.min(window.innerWidth, window.innerHeight) * 0.013, 0, 2 * Math.PI);
    tick_ctx.fillStyle = rgbaCol('white', 1);
    tick_ctx.fill();
    // 删除圆中心圆
    tick_ctx.beginPath();
    tick_ctx.arc(centerX, centerY, Math.min(window.innerWidth, window.innerHeight) * 0.005, 0, 2 * Math.PI);
    tick_ctx.fillStyle = rgbaCol('black', 1);
    tick_ctx.fill();
    

}
init_canvas();
let ratio=0;
let ratio1=0;
function animate() {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    // 使用时间计算变化值，在0到2之间来回变化
    // const ratio = Math.abs(Math.sin(Date.now() / 2000)) * 1;
    // 绘制秒表盘和分钟表盘
    draw_sec_watchface(seconds, ratio);
    draw_min_watchface(ratio1);
    draw_hour_watchface();
    requestAnimationFrame(animate);
}
function easeInOutQuint(t) {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
}
function tweenRatio(target, duration = 2000) {
    const start = ratio;
    const change = target - start;
    const startTime = performance.now();
    function animateRatio(currentTime) {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1); // Ensure t is between 0 and 1
        const easedT = easeInOutQuint(t); // Use the quint easing function
        ratio = start + change * easedT;
        if (t < 1) {
            requestAnimationFrame(animateRatio);
        } else {
            ratio = target;
        }
    }
    requestAnimationFrame(animateRatio);
}
function tweenRatio1(target, duration = 2000) {
    const start = ratio1;
    const change = target - start;
    const startTime = performance.now();
    function animateRatio(currentTime) {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1); // Ensure t is between 0 and 1
        ratio1 = start + change * easeInOutQuint(t); // Use the quint easing function
        if (t < 1) {
            requestAnimationFrame(animateRatio);
        } else {
            ratio1 = target;
        }
    }
    requestAnimationFrame(animateRatio);
}

animate();
const ease_sec = BezierEasing(.84,.05,.15,.96);
document.body.onclick = function() {
    if (ratio === 0) {
        tweenRatio(1);
    } else if (ratio1 === 0) {
        tweenRatio1(1);
    } else {
        tweenRatio(0);
        tweenRatio1(0);
    }
    
}
document.body.onresize = function() {
    init_canvas();
}
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.color_hour) {
            COLORS.hour = properties.color_hour.value.split(' ').map(c => Math.round(parseFloat(c) * 255)).join(',');
        }
        if (properties.color_minute) {
            COLORS.minute = properties.color_minute.value.split(' ').map(c => Math.round(parseFloat(c) * 255)).join(',');
        }
        if (properties.color_second) {
            COLORS.second = properties.color_second.value.split(' ').map(c => Math.round(parseFloat(c) * 255)).join(',');
        }
        // Add more properties here
    },
};