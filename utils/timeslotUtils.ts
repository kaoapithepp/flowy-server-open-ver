import { sequelize } from "../config/configDB";

// models
import Timeslot from "../models/Timeslot.model";

// utils
import { flatten2dLists } from "./flatten2dLists";

export async function genereateTimeslotRecordEachDesk(elem: any){
  var startTime = Number(elem.open_hr.substr(0,2));
  var endTime = Number(elem.close_hr.substr(0,2));
  var startMinute = elem.open_hr.substr(2,3);
  var endMinute = elem.close_hr.substr(2,3);

  const DAY_HR_FORMAT = 24;
  let itr = 0;
  let timeStops = [];
  
  if(endTime > startTime) itr = endTime - startTime;
  if(endTime < startTime) itr = DAY_HR_FORMAT - (startTime - endTime);

  function reformatHr(originalTime: number){
    if(originalTime < DAY_HR_FORMAT) {
      return originalTime < 10 ? `0${originalTime}`: originalTime;
    }

    if(originalTime >= DAY_HR_FORMAT) {
      const diff = originalTime - DAY_HR_FORMAT;
      return diff < 10 ? `0${diff}`: diff;
    }
  }
  
  for(let i = 0; i < itr ; i++) {
    timeStops.push({
      desk_id: elem.desk_id,
      status: 'vacant',
      orderNo: i+1,
      occupied_seat: 0,
      start_time: `${reformatHr(startTime+i)}${startMinute}`,
      end_time: `${reformatHr(startTime+i+1)}${endMinute}`
    })
  }

  return timeStops;
}

export async function createTimeSlotForAllDesksRoutine(){
  try {        
      const [deskResults, metadata] = await sequelize.query(`
          SELECT Desk.desk_id, Desk.place_id, Place.open_hr, Place.close_hr
          FROM Desk
          JOIN Place ON Desk.place_id = Place.place_id
      `);

      const mappedDeskWithTimeSlot = await Promise.all(deskResults.map(async (desk: any, key) => {
          const mappedResults = await genereateTimeslotRecordEachDesk(desk);
          
          return mappedResults;
      }));

      const flattenMappledResults = await flatten2dLists(mappedDeskWithTimeSlot);

      if(flattenMappledResults){
          Promise.all(flattenMappledResults.map(async(timeslot: any) => {
              const createdTimeSlot = await Timeslot.create(timeslot);
              return createdTimeSlot;
          }))
          .then(elem => {
              const date = new Date();
              console.log(`Timeslot routinely generated at: ${date}`);
          })
          .catch(err => { throw new Error(err.message) })
      }

  } catch(err: any) {
      throw new Error(err.message);
  }
}

export async function createTimeSlotForDeskSingle(deskId: string){
  const desk_id = deskId;
  try {        
      const [deskResults, metadata] = await sequelize.query(`
          SELECT Desk.desk_id, Desk.place_id, Place.open_hr, Place.close_hr
          FROM Desk
          JOIN Place ON Desk.place_id = Place.place_id
          WHERE Desk.desk_id = ?
      `,{
        replacements: [desk_id]
      });

      const mappedDeskWithTimeSlot = await Promise.all(deskResults.map(async (desk: any, key) => {
          const mappedResults = await genereateTimeslotRecordEachDesk(desk);
          
          return mappedResults;
      }));

      const flattenMappledResults = await flatten2dLists(mappedDeskWithTimeSlot);

      if(flattenMappledResults){
          Promise.all(flattenMappledResults.map(async(timeslot: any) => {
              const createdTimeSlot = await Timeslot.create(timeslot);
              return createdTimeSlot;
          }))
          .then(elem => {
              return elem;
          })
          .catch(err => { throw new Error(err.message) })
      }

  } catch(err: any) {
      throw new Error(err.message);
  }
}