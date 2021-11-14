<template>
    <div class="loop-pie center">
        {{text}}
        <div class="loop-pie-line loop-pie-r">
            <div class="loop-pie-c loop-pie-rm" id="loop-rc" :style="loopsRtyle"></div>
        </div>
        <div class="loop-pie-line loop-pie-l">
            <div class="loop-pie-c loop-pie-lm" id="loop-lc" :style="loopsLtyle"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loopPie',
    props:{
        total:{
            type:Number,
            default:150
        },
        val:{
            type:Number,
            default:100
        },
        text:{
            type:Number | String,
            default:0
        },
        color:{
            type:String,
            default:'rgb(78,130,243)'
        }
    },
    computed:{
        loopsRtyle(){
            return `transform : rotate(${this.rotateRight}deg);
                    border-top:3px solid #f5f5f5;
                    border-left:3px solid #f5f5f5;
                    border-bottom:3px solid ${this.color};
                    border-right:3px solid ${this.color}; `
        },
        loopsLtyle(){
            return `transform : rotate(${this.rotateLeft}deg);
                    border-top:3px solid #f5f5f5;
                    border-left:3px solid #f5f5f5;
                    border-bottom:3px solid ${this.color};
                    border-right:3px solid ${this.color}; `
        },
        rotateLeft(){
            var rotate = (this.val / this.total) * 360
            let x = -45
            if(rotate >= 180){
                this.leftX = rotate + 180 + x
            }else{
                this.leftX = 315
            }
            return  this.leftX 
        },
        rotateRight(){
            var rotate = (this.val / this.total) * 360
            let x = -45
            var rotateRight = 180 + x
            if(rotate < 180){
                rotateRight = rotate + x
            }
            return  rotateRight
        }
    },
    data () {
        return {
            leftX:-45,
        };
    },
    created () {
    },
    mounted () {
    },
    methods: {
    }
};
</script>

<style scoped lang="scss">
.loop-pie {
	position:relative;
	width:40px;
	height:40px;
}
.loop-pie-line {
	position:absolute;
	width:50%;
	height:100%;
	top:0;
	overflow:hidden;
}
.loop-pie-l {
	top:0px;
	left:0px;
}
.loop-pie-r {
    top:0px;
    transform:rotate(180deg);
	-webkit-transform:rotate(180deg);
	right:0px
}
.loop-pie-c {
	width:200%;
	height:100%;
	border:4px solid transparent;
	border-radius:50%;
	position:absolute;
	box-sizing:border-box;
    top:0;
    transform:rotate(-45deg);
    transition: all 2s;
	-webkit-transform:rotate(-45deg);
}
</style>
