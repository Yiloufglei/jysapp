<template>
    <div class="circle">
        <canvas id="drawing" width="170px" height="170px"></canvas>
    </div>
</template>
<script>

export default {
    props: {
    },
    data () {
        return {
            centerPrice: 0,
            ctx: '',
            outr: 85,//外半径
            inr: 56,
            ox: '',
            oy: '',
            pieData:{}
        };
    },
    computed:{
        rate () {
            let num = this.pieData.win > 0 ? this.pieData.win : this.pieData.loss || 0
            let nums =  this.pieData.win > 0 ? this.pieData.total_allocation : this.pieData.baseCount
            return  (this.winTransport === 1 ? '+' : '') + ((num / nums) * 100).toFixed(2) + '%';
        },
        winTransport () {
            if(Math.abs(this.pieData.win) > 0){
                return 1 
            }
            if(Math.abs(this.pieData.loss) > 0){
                return 2
            }
            return ''
        },
        winLossNumber () {
            let num = 0;
            let x 
            if (Math.abs(this.pieData.win) > 0){
                num = this.pieData.win
                x = Math.abs(num / this.pieData.total_allocation)
            }else if (Math.abs(this.pieData.loss) > 0) {
                num = this.pieData.loss
                x = Math.abs(num / this.pieData.baseCount)
            };
            if (Math.abs(this.pieData.loss) > Math.abs(this.pieData.baseCount)) {
                let lossX = Math.abs(this.pieData.loss) > 100 ? 100 : this.pieData.loss
                return [lossX, 0]
            }
            //盈亏   总数
            let y = (1 - x)
            return [x,y]
        },
    },
    methods: {
        PieChart (data) {
            this.pieData = data
            let drawing = document.getElementById('drawing');
            this.ctx = drawing.getContext('2d');
            // 环形图圆心
            this.ox = (drawing.width - this.outr * 2) / 2 + this.outr;
            this.oy = (drawing.height - this.outr * 2) / 2 + this.outr;
            this.init(this.winLossNumber)
        },
        init (data) {
            this.drawPie(data);
            this.drawingCenterText();
        },
        drawPie (data) {
            // 绘制饼图
            var startAngle = 1.5 * Math.PI,
                endAngle = 1.5 * Math.PI; //起始、结束弧度
            for (var i = 0, len = data.length; i < len; i++) {
                this.ctx.beginPath() //开始绘制
                endAngle += data[i] * 2 * Math.PI; //确定结束弧度
                var grad0 = this.ctx.createLinearGradient(0, 0, 300, 0); //创建一个渐变色线性对象
                grad0.addColorStop(0, "#f6e3a1");  //定义渐变色颜色  盈利
                grad0.addColorStop(1, "#FF2246");
                var grad1 = this.ctx.createLinearGradient(0, 0, 300, 0); //创建一个渐变色线性对象
                grad1.addColorStop(0, "#348fe6"); //定义渐变色颜色   亏损
                grad1.addColorStop(1, "#625bef");
                if (i === 0) {
                    if(this.winTransport === 1){
                        this.ctx.fillStyle = grad1; //设置填充颜色
                    }else{
                        this.ctx.fillStyle = grad0; //设置填充颜色
                    }
                }
                if (i === 1) {
                    if(this.winTransport === ''){
                        this.ctx.fillStyle = '#4e72b8'; //设置填充颜色
                    }else{
                        this.ctx.fillStyle = 'rgba(0,0,0,0.1)'; //设置填充颜色
                    }
                }
                this.ctx.moveTo(this.ox, this.oy) //位置挪到先前设置的圆心
                this.ctx.arc(this.ox, this.oy, this.outr, startAngle, endAngle, false) //画大饼
                this.ctx.fill(); //填充
                // 画延长线
                startAngle = endAngle //更新起始弧度
                // 绘制中间圆
            }
            this.drawingCover();
        },
        drawingCenterText () {
            //开始绘制价格
            this.ctx.beginPath();
            this.ctx.textAlign = 'center';
            this.ctx.font = '22px 微软雅黑';
            let color = this.winTransport === 1 ? '#03ad8f' : this.winTransport === 2 ? '#d14b64' : '#333'
            this.ctx.fillStyle = color
            this.ctx.fillText(this.rate, this.ox, this.oy + 12);
        },
        drawingCover () {
            this.ctx.beginPath() //开始绘制
            this.ctx.moveTo(this.ox, this.oy) //位置挪到先前设置的圆心
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.arc(this.ox, this.oy, this.inr, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
    },
};
</script>
<style lang="scss" scoped>
</style>