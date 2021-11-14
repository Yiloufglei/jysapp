<template>
  <div class="table-box">
    <table class="table">
      <thead>
        <tr>
          <th>币对名称</th>
          <th>价格/数量</th>
          <th>买卖状态</th>
          <th>成交时间</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="upper">{{ billData.coinInfo.coinName }}</td>
          <td>{{ billData.entrustPrice }}/{{ billData.entrustNums }}</td>
          <td>{{ tradeStatus }}</td>
          <td>{{$formatDate(billData.createdAt,'/')}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    billData: { type: Object, default: () => {} },
  },
  computed: {
    // 1.未成交；2.部分成交；3.全部完成；4.全部撤销；5.部分撤销。
    tradeStatus() {
      if (this.billData.tradeStatus) {
        switch (this.billData.tradeStatus) {
          case 1:
            return "未成交";
          case 2:
            return "部分成交";
          case 3:
            return "全部完成";
          case 4:
            return "全部撤销";
          case 5:
            return "部分撤销";
          default:
            return "";
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.table-box {
  // margin-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
}
.table {
  width: 100%;
  padding: 0 16px;
  th {
    color: #9a9a9a;
    font-weight: 400;
  }
  td {
    font-size: 12px;
    text-align: center;
  }
  th,
  td {
    width: 25%;
    text-align: left;
  }
}
</style>