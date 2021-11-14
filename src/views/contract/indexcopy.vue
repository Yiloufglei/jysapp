<template>
    <div class="contractIndex">
        <van-sticky>
            <nav class="nav center">
                <dl class="nav-active">USDT合约</dl>
                <!-- <dl>期权</dl> -->
            </nav>
        </van-sticky>
        <div class="container_box overflowPatible">
            <section class="trade-panel">
                <section class="trade-symbol between col-center">
                    <div class="symbol-name flex col-center fzboid" @click="showSideBar = true">
                        <span class="upper">{{ symbolName }}</span><i class="iconfont iconyou1"></i>
                    </div>
                    <div class="sym-cur-info col-center" :class="percentRange + '-color'">
                        <span>{{ realPrice }}</span>
                        <span>{{ percent }}</span>
                        <img @click="toChart" src="~@/assets/imgs/view-chart-icon.png" alt="">
                    </div>
                </section>
                <div class="transactionType flexC_S">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="treatyType" :options="transactionList" />
                    </van-dropdown-menu>
                    <span>08:00 预测资金费率0.010000%</span>
                </div>
                <div class="profitDetailed flexC_S">
                    <div class="t_l">
                        <p class="col-center">{{treatyIndexObj.accountRights || '0.00'}}<i class="iconfont iconzhuanrangzhuchiren sell-color" @click="$router.push('/capitalTransfer')"></i></p>
                        <span>账户总收益USDT</span>
                    </div>
                    <div class="t_l">
                        <p>{{treatyIndexObj.closePrise || '--'}}</p>
                        <span class="col-center">
                            <span>预估强平价USDT</span>
                            <i class="iconfont iconwenhao" @click="showQiangping = true"></i>
                        </span>
                    </div>
                    <div class="t_r">
                        <p>{{treatyIndexObj.securedRate ? treatyIndexObj.securedRate + '%' : '--'}}</p>
                        <span class="col-center">
                            <span>担保资产率</span>
                            <i class="iconfont iconwenhao" @click="showGuarantee = true"></i>
                        </span>
                    </div>
                </div>
            </section>
        </div>
        <div class="interval_bj"></div>
        <div class="openempty_tab">
            <van-tabs v-model="activeName">
                <van-tab title="开仓" name="open"></van-tab>
                <van-tab title="平仓" name="empty"></van-tab>
            </van-tabs>
        </div>
        <div class="operation_box flex">
            <div class="operation_box_l">
                <div class="dropDown_box flexC_S">
                    <div class="dropDown_box_l">
                        <van-popover
                            v-model="showEntruPopover"
                            trigger="click"
                            :actions="entrustList"
                            @select="entrusonSelect"
                        >
                            <template #reference>
                                <span>{{entrustObj.text}}</span><i class="iconfont iconsanjiao-top"></i>
                            </template>
                        </van-popover>
                    </div>
                    <div class="dropDown_box_r flexC_S" @click="showMultiple=true"><span class="color_b">{{multiple}}X</span><i class="iconfont iconsanjiao-top"></i></div>
                </div>
                <div class="dropDown_box flexC_S" style="margin:12px 0 6px">
                    <Input type="number" v-model="basicPrise" @focus="priceInput = true" :precision="symbolBasicAccuracy" placeholder="委托价"/>
                    <div v-if="activeName === 'empty'" class="dropDown_box_r center" style="width:25px"><i class="iconfont iconshandian"></i></div>
                </div>
                <p class="numericalValue">≈ {{this.$fomatFloat(basicPrise * usdt_cny, 4)}} CNY</p>
                <div class="dropDown_box flexC_S" style="margin:10px 0 5px">
                    <Input type="number" v-model="mainCoinNum" :precision="symbolMainAccuracy" placeholder="数量" @input="mainCoinNumChange"/>
                    <div class="dropDown_box_r flexC_S upper" @click="showSheet = true"><span>{{numberType}}</span><i class="iconfont iconsanjiao-top"></i></div>
                </div>
                <p class="numericalValue upper">= {{sheetNumber}}</p>
                <div class="limit-group between">
                    <slider ref="slider" @setOpacityConfig="setOpacityConfig" :max="maxShertNum"></slider>
                </div>
                <div class="btn_box">
                    <van-button type="default" block color="#03AD8F" :disabled="buyDisabled"  @click="submit(1)" :class="token ? 'buyButton' : ''">{{token ? '买入开多' :'登录'}}</van-button>
                </div>
                <p class="openable" style="margin-bottom:10px">可开多{{maxShertNum}}张</p>
                <div class="btn_box">
                    <van-button type="default" block color="#D14B64" :disabled="sellDisabled"  @click="submit(2)" :class="token ? 'sellButton' : ''">{{token ? '卖入开空' : '注册'}}</van-button>
                </div>
                <p class="openable">可开空{{maxShertNum}}张</p>
            </div>
            <div class="operation_box_r">
                <div class="handicap-title between upper">
                    <span>价格({{ coin.base }})</span>
                    <span>数量({{ coin.quote }})</span>
                </div>
                <div class="handicap-sell">
                    <Handicap :depthData="sellList" type="sell" @setPrice="setPrice" />
                </div>
                <div class="operation_c">
                    <p  :class="percentRange + '-color'">{{ realPrice }}</p>
                    <p class="color_c">≈ ￥{{ $fomatFloat((realPrice * usdt_cny),4) }}</p>
                </div>
                <div class="handicap-buy">
                    <Handicap :depthData="buyList" type="buy" @setPrice="setPrice" />
                </div>
            </div>
        </div>
        <div class="interval_bj"></div>
        <div class="order_tab">
            <van-tabs v-model="orderActiveName" animated swipeable lazy-render>
                <van-tab title="持仓" name="position">
                    <div class="order_ul" v-for="(item ,index) in positionList" :key="index">
                        <div class="title upper">
                            <p>{{item.coins.split('/')[0] + '永续' + item.coins.split('/')[1] + '·' + (item.unit === 1 ? '逐仓' : '全仓')}} <span :class="item.direction === 1 ? 'buy-color' : 'sell-color'">{{item.multiple}}X·{{item.direction === 1 ? '开多' : '开空'}}</span></p>
                        </div>
                        <div class="profit flexC_S">
                            <div class="profit_l">
                                <p class="profit_title">收益(USDT)</p>
                                <p class="profit_number">{{item.profit}}</p>
                            </div>
                            <div class="profit_r t_r">
                                <p class="profit_title">收益率</p>
                                <p class="profit_number buy-color">{{item.profitRate}}%</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">持仓量(BTC)</p>
                                <p class="profit_number">{{item.totalHolds}}</p>
                            </div>
                            <div>
                                <p class="profit_title">开仓均价(USDT)</p>
                                <p class="profit_number">{{item.openAveragePrise}}</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">最新价(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">可平量(BTC)</p>
                                <p class="profit_number">{{item.leftHolds}}</p>
                            </div>
                            <div>
                                <p class="profit_title">持仓担保资产(USDT)</p>
                                <p class="profit_number">{{item.securedAssets}}</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">预估强平价(USDT)</p>
                                <p class="profit_number ">xxx</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">持仓均价(USDT)</p>
                                <p class="profit_number">{{item.holdAveragePrise}}</p>
                            </div>
                            <div>
                                <p class="profit_title">担保资产率</p>
                                <p class="profit_number">{{item.securedAssetsRate}}%</p>
                            </div>
                            <div></div>
                        </div>
                        <div class="profit_btn flexC_S">
                            <div class="color_b" @click="openClosePosition(1)">平仓</div>
                            <div class="color_b" @click="openClosePosition(2)">闪电平仓</div>
                            <div @click="openProfitLoss(1)">止盈</div>
                            <div @click="openProfitLoss(2)">止损</div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="限价委托" name="fixedPrice">
                    <div class="order_ul">
                        <div class="title flexC_S">
                            <p>BTC 永续/USDT·逐仓<span class="buy-color">20X·开多</span></p>
                            <div class="color_b">撤销</div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">委托量(BTC)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">委托价(USDT)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">担保资产(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">成交量(BTC)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">成交均价(USD)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">手续费(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <p class="ordertime color_c">下单时间 14:10 06/02</p>
                    </div>
                </van-tab>
                <van-tab title="计划委托" name="plan">
                    <div class="order_ul">
                        <div class="title flexC_S">
                            <p>BTC 永续/USDT·逐仓<span class="buy-color">20X·开多</span></p>
                            <div class="color_b">撤销</div>
                        </div>
                        <div class="profitDetail flexC_S">
                            <div>
                                <p class="profit_title">委托量(BTC)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">触发价(USDT)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">委托价(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <p class="ordertime color_c">下单时间 14:10 06/02</p>
                    </div>
                </van-tab>
            </van-tabs>
            <div class="allOrder_abs color_c col-center" @click="$router.push('/contractHistory')">
                <i class="iconfont iconjilu"></i> 全部
            </div>
        </div>
        <!-- 下单确认弹窗 -->
        <van-dialog v-model="showPlaceOrder" title="" :showConfirmButton="false">
            <p class="title">确认订单</p>
            <ul class="upper">
                <li><span class="color_c">交易</span><span>{{direction === 1 ? '买入开多' : '卖入开空'}}</span></li>
                <li><span class="color_c">种类</span><span>{{ coin.quote }} 永续/{{ coin.base }}·{{treatyType === 1 ? '逐仓' : '全仓'}}</span></li>
                <li><span class="color_c">委托价格</span><span>{{basicPrise}}USDT</span></li>
                <li><span class="color_c">数量</span><span>{{mainCoinNum}}张 = {{ (mainCoinNum * symbolConfig.eachTreatyValue) + coin.quote }}</span></li>
            </ul>
            <van-row type="flex" justify="space-between" gutter="15">
                <van-col span="12">
                    <van-button type="default" block size="small" @click="showPlaceOrder = false">取消</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="info" block size="small" @click="confirmOrder">确认</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 开通弹窗 -->
        <van-dialog v-model="showOpening" title="" :showConfirmButton="false">
            <div class="img_box">
                <img src="@/assets/imgs/showOpening.png" alt="">
            </div>
            <p class="conten_text">USDT永续合约暂未开通，开通后，可进行USDT永续合约相关操作</p>
            <p class="agreement color_c flex">
                <van-checkbox v-model="hideSmall" shape="square" icon-size="16px">我已理解并同意<span class="color_b">《合约风险协议》</span></van-checkbox>
            </p>
            <van-row type="flex" justify="space-between" gutter="15">
                <van-col span="12">
                    <van-button type="default" block size="small" @click="showOpening = false">取消</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="info" block size="small" :disabled="!hideSmall" @click="treatyOpening">同意开通</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 未实名认证去认证弹窗 -->
        <van-dialog v-model="showAttestation" title="" :showConfirmButton="false">
            <p class="conten_text">USDT永续合约暂未开通，开通前，需要进行实名认证</p>
            <van-row type="flex" justify="space-between" gutter="15">
                <van-col span="12">
                    <van-button type="default" block size="small" @click="showAttestation = false">取消</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="info" block size="small" @click="goAttestation">去认证</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 担保资产率说明弹窗 -->
        <van-dialog v-model="showGuarantee" title="" :showConfirmButton="false">
            <p class="title">担保资产率说明</p>
            <p class="conten_text">当担保资产率下降到0% ，系统将把您当前合约账户内的仓位进行强制平仓。</p>
            <van-row type="flex" justify="space-between" gutter="15">
                <van-col span="12">
                    <van-button type="default" block size="small" @click="showGuarantee = false">知道了</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="info" block size="small">调整担保资产</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 强平说明弹窗 -->
        <van-dialog v-model="showQiangping" title="" :showConfirmButton="false">
            <p class="title">预估强平价说明</p>
            <p class="conten_text upper">此预估强平价表示,当您的担保资产率等于0%时,{{coin.quote}}的预估价格。</p>
            <p class="conten_text upper">全仓模式下所有品种共享{{ coin.base }}全仓账户的担保资产,所有有持仓的品种会同时触发强平,不同品种的预估强平价不同。此价格仅供参考,强平以担保资产率为准。</p>
            <van-row type="flex" justify="space-between">
                <van-col span="24">
                    <van-button type="info" block size="small" @click="showQiangping = false">知道了</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 币 / 张 切换弹窗 -->
        <van-action-sheet v-model="showSheet" title="" close-on-popstate lazy-render  @closed="sheetClose">
            <div class="content">
                <div class="title flexC_S"><p>合约单位设置</p><span class="color_c" @click="showSheet = false">关闭</span></div>
                <div class="content_box">
                    <p>选择单位</p>
                    <div class="card_box upper">
                        <van-tabs type="card" v-model="unit">
                            <van-tab :title="item.title" :name='item.name' v-for="item in sheetList" :key="item.name"></van-tab>
                        </van-tabs>
                    </div>
                    <p class="color_c conversion upper">{{ coin.quote }}永续/{{ coin.base }}：1张 = {{ symbolConfig.eachTreatyValue + coin.quote }}</p>
                    <van-button type="info" block  @click="submitSheet">确认</van-button>
                </div>
            </div>
        </van-action-sheet>
        <!-- 倍数选择弹窗 -->
        <van-action-sheet v-model="showMultiple" title="" close-on-popstate lazy-render @closed="multipleClose">
            <div class="content">
                <div class="title flexC_S"><p>BTC 永续/USDT·逐仓<span class="buy-color"> {{multiple}}X·开多</span></p><span class="color_c" @click="showMultiple = false">关闭</span></div>
                <div class="content_box">
                    <div class="stepper_box">
                        <van-stepper v-model="selectMultiple" @blur="stepperChange" :max="maxMultiple" :min="minMultiple" integer input-width="calc(100% - 70px)" button-size="35px"/>
                        <div class="absSpan" :style="{transform: `translate(${String(selectMultiple).length * 5}px,-50%)`}">X</div>
                    </div>
                    <div class="vanSlider_box">
                        <vanSlider @input="vanSliderInput" :value="selectMultiple" :min="minMultiple" :max="maxMultiple"/>
                    </div>
                    <div class="details flexC_S conversion">
                        <div>
                            <p>2871181.12</p>
                            <p class="color_c">可用担保资产</p>
                        </div>
                        <div style="padding-left: 30px;">
                            <p>2871181.12</p>
                            <p class="color_c">可开多</p>
                        </div>
                        <div class="t_r">
                            <p>32张</p>
                            <p class="color_c">可开空</p>
                        </div>
                    </div>
                    <van-button type="info" block  @click="submitMultiple">确定</van-button>
                </div>
            </div>
        </van-action-sheet>
        <!-- 止损止盈弹窗 -->
        <van-action-sheet v-model="showProfitLoss" title="" close-on-popstate lazy-render>
            <div class="content">
                <div class="title flexC_S"><p>BTC 永续/USDT·逐仓<span class="buy-color"> 20X·开多</span></p><span class="color_c" @click="showProfitLoss = false">取消</span></div>
                <div class="content_box">
                    <div class="details flexC_S">
                        <div>
                            <p class="color_c">开仓均价(USDT)</p>
                            <p>2871181.12</p>
                        </div>
                        <div>
                            <p class="color_c">最新价(USDT)</p>
                            <p>2871181.12</p>
                        </div>
                        <div class="t_r">
                            <p class="color_c">收益率</p>
                            <p class="sell-color">-21.12%</p>
                        </div>
                    </div>
                    <div class="profitLosstab">
                        <van-tabs v-model="profitLossActiveName" animated swipeable lazy-render>
                            <van-tab title="按价格触发" name="price"></van-tab>
                            <van-tab title="按收益率触发" name="profit"></van-tab>
                        </van-tabs>
                        <Input type="number" v-model="profitLoss.val" :placeholder="profitLossActiveName === 'price' ? '触发价' : '收益率'" :coinName="profitLossActiveName === 'price' ? 'USDT' : '%'" style="margin-top:15px"/>
                        <div class="score_box flexC_S"  style="margin-top:20px">
                            <Input type="number" v-model="profitLoss.num" placeholder="数量" coinName="张" />
                            <div class="score_ul flexC_S">
                                <div class="center" v-for="(item,index) in scoreList" :key="index">{{item}}</div>
                            </div>
                        </div>
                        <p class="color_c keping">可平300张</p>
                    </div>
                    <van-button type="info" block  @click="submitProfitLoss">计划委托-{{profitLossType === 1 ? '止盈' : '止损'}}</van-button>
                </div>
            </div>
        </van-action-sheet>
        <!-- 平仓 / 闪电平仓弹窗 -->
        <van-action-sheet v-model="showClosePosition" title="" close-on-popstate lazy-render>
            <div class="content">
                <div class="title flexC_S"><p>BTC 永续/USDT·逐仓<span class="buy-color"> 20X·开多</span></p><span class="color_c" @click="showClosePosition = false">取消</span></div>
                <div class="content_box">
                    <div class="profitLosstab">
                        <Input type="number" v-model="closePosition.val" placeholder="触发价" coinName="USDT"/>
                        <p class="color_c keping"   style="margin:10px 0">≈10.21CNY</p>
                        <div class="score_box flexC_S">
                            <Input type="number" v-model="profitLoss.num" placeholder="数量" coinName="张" />
                            <div class="score_ul flexC_S">
                                <div class="center" v-for="(item,index) in scoreList" :key="index">{{item}}</div>
                            </div>
                        </div>
                        <p class="color_c keping">可平300张</p>
                    </div>
                    <van-button type="info" block  @click="submitClosePosition"><i v-if="closePositionType === 2" class="iconfont iconshandian"></i>{{closePositionType === 1 ? '平仓' : '闪电平仓'}}</van-button>
                </div>
            </div>
        </van-action-sheet>
        <!-- <Sidebar v-model="showSideBar" @switchSymbolFun="switchSymbolFun" /> -->
        <Sidebar
            v-model="showSideBar"
            title="合约交易"
            :marketList="marketList"
            :pricePrecision="2"
            :tradeBaseCoin="tradeBaseCoin"
            @switchSymbolFun="switchSymbolFun"
        />
        <div class="page-mask" v-show="showMask" @click="closeMask"></div>
    </div>
</template>
<script>
import Input from "./input";
import Handicap from "./handicap";
import Sidebar from "@/components/sidebar";
import vanSlider from "@/components/common/vanSlider";
import { worker } from "@/utils/webWorker.js";
import { mapGetters, mapState } from "vuex";
import leverMixin from "@/views/leverage/mixin.js";
import slider from "@/components/slider";
import _find from 'lodash/find'
import { treatyCoinConfig , treatyIndex ,treatyBuy ,treatyOpening ,treatyStopProfit ,treatyStopLoss} from "@/api/contract"
export default {
    components: {
        Input, Handicap, Sidebar, slider,vanSlider,
    },
    name:'contractIndex',
    data () {
        return {
            transactionList: [
                { text: "逐仓", value: 1 },
                { text: "全仓", value: 2 },
            ],
            entrustList: [
                { text: "限价委托", value: 1 },
                { text: "计划委托", value: 2 },
            ],
            numberType:'张',
            unit:1,
            scoreList:['10%','20%','50%','100%'],//平仓百分比
            showProfitLoss:false,
            showAttestation:false,
            showOpening:false,
            profitLossType:1,//止盈止损类型
            closePositionType:1,//平仓 / 闪电平仓类型
            showPlaceOrder:false,
            showClosePosition:false,
            profitLossActiveName:'price',
            showMultiple:false,
            showSheet:false,
            showEntruPopover:false,
            showGuarantee: false,
            showQiangping: false,
            showMask: false,
            showSideBar: false,
            firstType: true, //首次进去页面
            orderActiveName: 'position',//订单tab窗口
            activeName: 'open',//开仓平仓tab
            treatyType: 1,//仓位类型
            selectMultiple: 20,//选择中的倍数
            hideSmall:false,//同意开通状态
            profitLoss:{//止损止盈弹窗
                val:'',
                num:''
            },
            closePosition:{//平仓 / 闪电平仓弹窗
                val:'',
                num:''
            },
            direction:'',//下单类型
            entrustObj:{ text: "限价委托", value: 1 },
            minMultiple:1,//最小倍数
            maxMultiple:120,//最大倍数
            multiple:20,//倍数
            overviewData: {},//当前币种行情
            mainCoinNum: '',//下单数量
            basicPrise: '',//下单价格
            buyList: [], // 盘口：买盘数据
            sellList: [], // 盘口：卖盘数据
            contractSymbolList:[],//合约币对列表
            treatyIndexObj:{},//合约头部信息
            symbolConfig:{},//合约当前币种信息
            priceInput: false, // 价格输入时
            maxShertNum:150,
            positionList:[
                {coins:'btc/usdt',unit:1,curPrise:'33880',direction:1,holdAveragePrise:38880,leftHolds:80,multiple:40,openAveragePrise:38400,profit:5000,profitRate:11.5,securedAssets:233,securedAssetsRate:2222,strongPrise:2333,totalHolds:2000},
                {coins:'eth/usdt',unit:2,curPrise:'33880',direction:2,holdAveragePrise:38880,leftHolds:80,multiple:21,openAveragePrise:38400,profit:5000,profitRate:11.5,securedAssets:233,securedAssetsRate:2222,strongPrise:2333,totalHolds:2000}
            ],
            marketList:{}
        };
    },
    mixins: [leverMixin],
    computed: {
        ...mapGetters(["usdt_cny"]),
        ...mapState({
            token: (state) => state.user.token,
            tradeBaseCoin: (state) => state.contract.tradeBaseCoin,
            contractSymbol: (state) => state.contract.contractSymbol,
            userInfo: (state) => state.user.userInfo,
        }),
        sheetNumber(){
            let x = 0
            if(this.unit === 1){
                x =  this.$fomatFloat(this.mainCoinNum * (this.symbolConfig.eachTreatyValue || 0), this.symbolMainAccuracy) + this.coin.quote
            }
            if(this.unit === 2){
                x =  this.$fomatFloat(this.mainCoinNum / (this.symbolConfig.eachTreatyValue || 0), this.symbolBasicAccuracy) + '张'
            }
            return x
        },
        sheetList(){
            return [
                {
                    title:'张',
                    name: 1
                },
                {
                    title: this.coin.quote,
                    name: 2
                }
            ]
        },
        buyDisabled(){
            if(!this.token){
                return false
            }
            return !(this.mainCoinNum && this.basicPrise && this.mainCoinNum > 0)
        },
        sellDisabled(){
            if(!this.token){
                return false
            }
            return !(this.mainCoinNum && this.basicPrise && this.mainCoinNum > 0)
        },
        // 实时价格
        realPrice () {
            if (this.overviewData.close) {
                const p = this.$fomatFloat(this.overviewData.close, this.symbolBasicAccuracy)
                if (!this.priceInput) {
                    this.basicPrise = p;
                }
                return p;
            }
            return 0
        },
        // 涨跌百分比
        percent () {
            if (this.overviewData.close) {
                let x = this.overviewData.close - this.overviewData.open
                return (x > 0 ? '+' : '') + Number((x / this.overviewData.open) * 100).toFixed(2) + "%"
            } else return "0%";
        },
        percentRange () {
            if (this.overviewData.close - this.overviewData.open > 0) return "up";
            else if (this.overviewData.close - this.overviewData.open < 0)
                return "down";
            else return "";
        },
        // 币对
        symbolName () {
            return this.contractSymbol
        },
        // 币对字符串 ws需要的币种
        symbolStr () {
            return (this.symbolName.split("/").join(""))
        },
        // 币对对象  页面显示
        coin () {
            const arr = this.symbolName.split("/");
            return { base: arr[1], quote: arr[0] };
        },
        symbolBasicAccuracy () {//基币精度
            return this.symbolConfig.basicAccuracy || 2
        },
        symbolMainAccuracy () {//币种精度
            return this.symbolConfig.mainAccuracy || 2
        },
    },
    methods: {
        submit(type){
            if(!this.token){
                let path = type === 1 ? '/login' : '/register'
                this.$router.push(path)
                return
            }
            if(this.userInfo.realnameStatus !== 3){
                this.showAttestation = true
                return
            }
            this.priceInput = true
            // if(this.token && !this.userInfo.canTreaty){
            //     this.showOpening = true
            //     return
            // }
            if((this.unit === 1 && this.mainCoinNum < this.symbolConfig.minOpen) || (this.unit === 2 &&  (this.mainCoinNum / this.symbolConfig.eachTreatyValue) < this.symbolConfig.minOpen)){
                this.$toast(`最小开单量为${this.symbolConfig.minOpen}`);
                return
            }
            if((this.unit === 1 && this.mainCoinNum > this.symbolConfig.maxOpen) || (this.unit === 2 &&  (this.mainCoinNum / this.symbolConfig.eachTreatyValue) > this.symbolConfig.maxOpen)){
                this.$toast(`最大开单量为${this.symbolConfig.maxOpen}`);
                return
            }
            this.direction = type
            this.showPlaceOrder = true
        },
        goAttestation(){
            this.showAttestation = false
            this.$router.push('/identityCard')
        },
        treatyOpening(){
            treatyOpening().then(res =>{
                if(!res.code){
                    this.$toast.success('开通成功')
                    this.$store.dispatch('updateUserInfo')
                    this.showOpening = false
                }
            })
        },
        stepperChange(e){
            if(e > this.maxMultiple){
                this.selectMultiple = this.maxMultiple
            }
        },
        vanSliderInput(val){
            this.selectMultiple = val
        },
        openClosePosition(type){
            this.closePositionType = type
            this.showClosePosition = true
        },
        submitClosePosition(){
            this.showClosePosition = false
        },
        openProfitLoss(type){
            this.profitLossType = type
            this.showProfitLoss = true
        },
        submitProfitLoss(){
            let params = {
                treatyId: this.symbolName,
                stype:'',
                con:'',
                nums:'',
            }
            console.log(params)
            // treatyStopProfit(params).then(res => {
            //     console.log(res,'rs')
            // })
            // treatyStopLoss(params).then(res => {
            //     console.log(res,'rs')
            // })
            // this.showProfitLoss = false
        },
        sheetClose(){
            this.unit = this.sheetList.find(v=> v.title === this.numberType).name
        },
        submitSheet(){
            this.numberType = this.sheetList.find(v=> v.name === this.unit).title
            this.mainCoinNum = ''
            this.showSheet = false
        },
        multipleClose(){
            this.selectMultiple = this.multiple
        },
        submitMultiple(){
            this.multiple = this.selectMultiple
            this.showMultiple = false
        },
        entrusonSelect(action,index){
            this.entrustObj = action
        },
        confirmOrder(){
            let params = {
                coins: this.symbolName,
                // coinId:this.symbolConfig.Id,
                tradeType:this.entrustObj.value,
                mainCoinNum:this.mainCoinNum,
                multiple:this.multiple,
                direction:this.direction,
                basicPrise:this.basicPrise,
                unit:this.unit,
                treatyType:this.treatyType
            }
            treatyBuy(params).then(res => {
                console.log(res,'rs')
            })
        },
        mainCoinNumChange(){
            let x = 0
            if(this.maxShertNum == 0){
                x = 0
             }else{
                if (this.unit === 1) {
                    x = this.mainCoinNum / this.maxShertNum * 100;
                } else {
                    x = (this.mainCoinNum / this.symbolConfig.eachTreatyValue) / this.maxShertNum * 100;
                }
            }
            x = parseInt(x) >= 100 ? 100 : parseInt(x)
            this.$refs.slider.buyNumberChange(x)
        },
        setOpacityConfig (val) {
            if(this.unit === 1){
                this.mainCoinNum = this.$fomatFloat((val * this.maxShertNum / 100), this.symbolBasicAccuracy)
            }
            if(this.unit === 2){
                this.mainCoinNum =  this.$fomatFloat((val * this.symbolConfig.eachTreatyValue  * this.maxShertNum / 100), this.symbolBasicAccuracy)
            }
        },
        closeMask () {
            this.showBuyType = false;
            this.showLever = false;
        },
        switchSymbolFun (newVal) {
            this.switchSymbol(newVal);
            this.showSideBar = false
            // this.buyNumber = this.$fomatFloat(0,this.symbolConfig.currencyAccuracy);
            this.$nextTick(() => {
                this.priceInput = false
            })
            this.$refs.slider.buyNumberChange(0)
        },
        setPrice (val) {
            this.priceInput = true
            this.basicPrise = val
        },
        toChart () {
            this.$store.commit('SET_SYMBOL', `${this.coin.quote}_${this.coin.base}`)
            this.$router.push({
                // path: "/market/chart?tradeType=contract"
                path: "/market/chart"
            });
        },
        subOverview () {
            // 单币对信息
            worker.postMessage({ type: "OVERVIEW", data: { coin: this.symbolStr }, });
        },
        unsubOverview () {
            // 关闭单币对信息
            worker.postMessage({ type: "UNSUB", data: { operate: "deldetail", data: { coin: this.symbolStr }, }, });
        },
        subHandicap () {
            // 盘口
            worker.postMessage({ type: "HANDICAP", data: { coin: this.symbolStr, type: '2', step: '1' } });
        },
        unsubHandicap () {
            // 关闭盘口
            worker.postMessage({ type: "UNSUB", data: { operate: "delhandicap", data: { coin: this.symbolStr, type: '2', step: '1' }, }, });
        },
        subCoins (optional) {
            // 行情
            worker.postMessage({ type: "MARKETB", data: { optional: optional } });
        },
        unsubCoins () {
            // 关闭行情
            worker.postMessage({ type: "UNSUB", data: { operate: "delcoins_b" } });
        },
        subToken () {
            // 委托
            worker.postMessage({ type: "TRADEORDER", data: { authtoken: this.token, type: '1' }, });
        },
        unsuToken () {
            // 关闭委托
            worker.postMessage({ type: "UNSUB", data: { operate: "delentrust", authtoken: this.token, type: '1' }, });
        },
        getMarketTab (data) {
            // 获取推送的key值
            let tab = Object.keys(data)
            tab.sort((o, t) => {
                return data[o].sort - data[t].sort
            })
            tab = tab.filter(item => {
                // 过滤自选
                return item !== 'optional'
            })
            return tab
        },
        //切换币种处理中心
        switchSymbol (newSymbol,type) {
            this.unsubOverview();
            this.unsubHandicap();
            this.unsubCoins()
            if (this.token) {
                //交易委托单
                this.unsuToken()
            }
            this.$store.commit('SET_CONTRACT_SYMBOL', newSymbol.toLowerCase())
            this.firstType = true
            this.init()
        },
        init () {
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    if (this.token) {
                        //交易委托单
                        // this.subToken()
                    }
                    // 全币种行情
                    this.subCoins('')
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        delws () {
            this.unsubCoins()
            this.unsubHandicap();
            this.unsubOverview();
            if (this.token) {
                //交易委托单
                // this.unsuToken()
            }
            worker.postMessage({ type: "CLOSE_WEBSOCKET" });
        },
        // ws数据处理
        listenWSData (data) {
            if (data.type === "rank_b" || data.type === "rank_p") {//币币列表行情
                let val = JSON.parse(data.data)
                if (this.firstType) {
                    // 获取基币数据非自选的第一条基币名称
                    const key = this.getMarketTab(val)[0]
                    let tempName = this.symbolName
                    if (this.firstType) {
                        // 获取基币数据非自选的第一条基币名称
                        const key = this.getMarketTab(val)[0]
                        let list  = val[key].symbollist
                        if(list.length && !_find(list, { symbol: this.symbolName.toUpperCase() })){
                            // 如果缓存中的币对不在币对列表中，则获取第一个
                            tempName = list[0].symbol.toLowerCase()
                        }
                        this.firstType = false
                        this.$store.commit('SET_CONTRACT_TRADE_BASE_COIN', key)
                        this.$store.commit('SET_CONTRACT_SYMBOL', tempName)
                    }
                    this.firstType = false
                    this.subHandicap();
                    this.subOverview();
                }
                this.marketList = val
            }
            if (data.type === "detail") {//单币对行情
                this.overviewData = JSON.parse(data.data);
            }
            if (data.type === "handicap") {//盘口
                if (data.data) {
                    const wsData = JSON.parse(data.data);
                    let buyList = wsData.buy || [];
                    let sellList = wsData.sell || [];
                    let sNum = sellList.reduce((prev, cur) => {
                        return prev + cur[1];
                    }, 0)
                    let bNum = buyList.reduce((prev, cur) => {
                        return prev + cur[1];
                    }, 0)
                    buyList.forEach((v) => {
                        v[0] = this.$fomatFloat(v[0], this.symbolBasicAccuracy)
                        v[1] = this.$numberFormat2(v[1], this.symbolConfig.currencyAccuracy)
                        v[2] = ((v[1] / bNum) * 100).toFixed(2)
                    })
                    sellList.forEach((v) => {
                        v[0] = this.$fomatFloat(v[0], this.symbolBasicAccuracy)
                        v[1] = this.$numberFormat2(v[1], this.symbolConfig.currencyAccuracy)
                        v[2] = ((v[1] / sNum) * 100).toFixed(2)
                    })
                    this.buyList = buyList
                    this.sellList = sellList
                }
            }
            if (data.type === "entrust") {
                const { entrustList } = JSON.parse(data.data);
                if (entrustList) {
                    let list = entrustList.sort((a, b) => {
                        return b.createdAt - a.createdAt
                    })
                    this.tradeList = list;
                } else {
                    this.tradeList = []
                }
            }
        },
        hiddenChange(){
            if(document.hidden) {
                this.firstType = true
                this.delws()
            }else{
                this.init()
            }
        },
    },
    created () {
        this.$store.dispatch("set_usdt_cny");
    },
    mounted () {
        this.init()
        document.addEventListener("visibilitychange", this.hiddenChange,false);
    },
    beforeDestroy () {
        document.removeEventListener('visibilitychange',this.hiddenChange,false);
    },
    watch: {

    },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>