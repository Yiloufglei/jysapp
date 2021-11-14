export default {
  filters: {
    transTitle(type) {
      switch (type) {
        case 1:
          return "按天";
        case 2:
          return "按周";
        case 3:
          return "按月";
        case 4:
          return "免息";
      }
    },
  },
}