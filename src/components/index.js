export const myVolume = function (PineJS) {
    return {
        name: "volume",
        metainfo: {
            _metainfoVersion: 40,
            id: "Volume2@tv-basicstudies-1",
            scriptIdPart: "",
            name: "volume",
            description: "volume",
            shortDescription: "volume",
            is_price_study: !1,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            transparency: 30,


            plots: [{
                    id: "vol",
                    type: "line"
                },
                {
                    id: "volumePalette",
                    palette: "volumePalette",
                    target: "vol",
                    type: "colorer"
                },
                {
                    id: "vol_ma",
                    type: "line"
                },
                {
                    id: "vol_ma2",
                    type: "line"
                }
            ],

            defaults: {
                styles: {
                    vol: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 5,
                        trackPrice: !1,
                        transparency: 30,
                        visible: !0,
                        color: "#000080"
                    },
                    vol_ma: {
                        linestyle: 0,
                        linewidth: 2,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 10,
                        visible: 1,
                        color: "#F4E4B0"
                    },
                    vol_ma2: {
                        linestyle: 0,
                        linewidth: 2,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 10,
                        visible: 1,
                        color: "#03ad8f"
                    }
                },
                precision: 0,
                palettes: {
                    volumePalette: {
                        colors: {
                            0: {
                                color: "rgba(209,75,100,1)",
                                width: 1,
                                style: 0
                            },
                            1: {
                                color: "rgba(3,173,143,1)",
                                width: 1,
                                style: 0
                            }
                        }
                    }
                },
                inputs: {
                    showMA: !1,
                    length: 5,
                    col_prev_close: !1,
                    length2: 10,
                }
            },
            styles: {
                vol: {
                    title: "Volume",
                    histogramBase: 0
                },
                vol_ma: {
                    title: "Volume MA",
                    histogramBase: 0
                }
            },

            palettes: {
                volumePalette: {
                    colors: {
                        0: {
                            name: "Falling"
                        },
                        1: {
                            name: "Growing"
                        }
                    }
                }
            },
            inputs: [{
                    id: "showMA",
                    name: "show MA",
                    defval: !1,
                    type: "bool",
                    isHidden: !0
                },
                {
                    id: "length",
                    name: "MA Length",
                    defval: 5,
                    type: "integer",
                    min: 1,
                    max: 2e3
                },
                {
                    defval: !1,
                    id: "col_prev_close",
                    name: "Color based on previous close",
                    type: "bool"
                },
                {
                    id: "length2",
                    name: "MA2 Length",
                    defval: 10,
                    type: "integer",
                    min: 1,
                    max: 2e3
                }
            ],
        },

        constructor: function () {
            this.f_0 = function (e, t) {

                    return PineJS.Std.gt(e, t) ? 0 : 1
                },
                this.init = function (context, inputCallback) {

                    this._context = context;
                    this._input = inputCallback;
                };
            this.main = function (e, t) {


                let i = PineJS.Std.volume(this._context);

                let n = PineJS.Std.volume(this._context);

                let o = this._context.new_var(n);
                let s = PineJS.Std.sma(o, this._input(1), this._context);
                let s2 = PineJS.Std.sma(o, this._input(3), this._context);
                let a = this._context.new_var(PineJS.Std.close(this._context));

                return [
                    i,
                    a.get(1) && this._input(2) ? this.f_0(a.get(1), ineJS.Std.close(this._context)) : this.f_0(PineJS.Std.open(this._context),
                        PineJS.Std.close(this._context)),
                    s,
                    s2,
                ]
            }
        }
    }
}



//   export const ZigZag2= function(PineJS) {
//       return {
//         name:"ZigZag2",
//         metainfo:{
//             _metainfoVersion:23,
//             isTVScript:!1,
//             isTVScriptStub:!1,
//             is_hidden_study:!1,
//             defaults:{
//                 styles:{
//                     plot_0:{
//                         linestyle:0,
//                         linewidth:2,
//                         plottype:0,
//                         trackPrice:!1,
//                         transparency:0,
//                         visible:!0,
//                         color:"#CCCCCC"
//                     }
//                 },
//                 precision:4,
//                 inputs:{
//                     in_0:5,
//                     in_1:5
//                 }
//             },
//                 plots:[
//                     {id:"plot_0",type:"line"},
//                     {id:"plot_1",target:"plot_0",type:"dataoffset"}
//                 ],
//                 styles:{
//                     plot_0:{title:"Plot",histogramBase:0,joinPoints:!1}
//                 },
//                 description:"ZigZag2",
//                 shortDescription:"ZigZag2",
//                 is_price_study:!0,
//                 name: "ZigZag2",
//                 classId:"ScriptWithDataOffset",
//                 id: "ZigZag2@tv-basicstudies-1",
//                 inputs:[
//                     {
//                         id:"in_0",
//                         name:"deviation",
//                         defval:5,
//                         type:"float",
//                         min:.001,
//                         max:100
//                     },
//                     {id:"in_1",name:"depth",defval:10,type:"integer",min:2,max:1e3}
//                 ],
//         },
//         constructor:function(){

//             this.main=function(e,t){
//                 this._context=e
//                 this._input=t;
//                 let i=this._input(0)
//                 let n=this._input(1);

//                 return[PineJS.Std.zigzag(i,n,this._context),PineJS.Std.zigzagbars(i,n,this._context)]
//             }
//         }
//     }
//   }