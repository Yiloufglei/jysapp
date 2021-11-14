<!-- 
  	author        MrYi
	time          2021/03/15
	description   全局自定义二次确认弹窗
 -->
<template>
	<transition name="fade">
		<div class="MySecondaryDialog">
            <van-dialog v-model="visible" title="" :width="width" :show-confirm-button="false">
				<div class="secondaryDialog_content">
					<div class="img_box">
						<img class="holdJustTemplate" src="@/assets/imgs/security.png" />
					</div>
					<p class="title t_c fzboid">{{title}}</p>
				</div>
				<slot></slot>
                <van-button class="van-mybutton" type="info" block @click="confirm" :disabled="disabled">{{confirmText}}</van-button>
                <div class="footer_p t_c">
                    <span class="color_b" @click="cancel">{{cancelText}}</span>
                </div>
			</van-dialog>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'MySecondaryDialog',
		props: {
			//显示隐藏
			visible: {
				type: Boolean,
				default: false
			},
			//对话框宽度
			width: {
				type: String,
				default: '295px'
			},
			//头部标题
			title: {
				type: String,
				default: '标题'
			},
			confirmText:{
				type: String,
				default: '确认'
			},
			cancelText:{
				type: String,
				default: '取消'
			},
			disabled:{
				type: Boolean,
				default: false
			},
			
		},
		data() {
			return {}
		},
		computed: {
		},
		components: {
        },
		methods: {
			cancel() {
				this.$emit('cancel')
			},
            confirm(){
                this.$emit('confirm')
            }
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .1s;
	}

	.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */
		{
		opacity: 0;
	}
    .van-mybutton{
        margin-top: 16px;
    }
	.MySecondaryDialog {
		z-index: 99;
		.secondaryDialog_content {
			.img_box {
				text-align: center;

				img {
					width: 104px;
					height: 80px;
				}
			}
			.title{
				font-size: 15px;
			}
		}
		.footer_p{
			font-size: 16px;
			line-height: 48px;
		}
	}
</style>
