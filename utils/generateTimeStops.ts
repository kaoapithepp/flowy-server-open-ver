import moment from "moment";

export function getTimeStops(start: string, end: string){
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');
    
    if( endTime.isBefore(startTime) ){
      endTime.add(1, 'day');
    }
  
    var timeStops = [];
  
    while(startTime <= endTime){
      timeStops.push(new (moment(startTime) as any).format('HH:mm'));
      startTime.add(1, 'hours');
    }
    return timeStops;
  }
  
//   var timeStops = getTimeStops('11:00', '23:00');
//   console.log('timeStops ', timeStops);