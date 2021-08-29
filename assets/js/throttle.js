export default function _throttle(fn, delay = 250) {
   if (typeof fn !== 'function') {
      console.error('Throttle: you must provide a function as the first argument for throttle');
      return;
   }
   if (typeof delay !== 'number') {
      console.error('Throttle: you must provide a number as the second argument for throttle');
   }

   let lastEventTimeStamp = null;

   return (...args) => {
      const now = Date.now();
      //    console.log("Date.now = ", now, "lastEventTimeStamp = ", lastEventTimeStamp);
      //    console.log("now - lastEventTimeStamp = ", now - lastEventTimeStamp);
      if (lastEventTimeStamp === null || now - lastEventTimeStamp >= delay+2) {
         lastEventTimeStamp = now;
         fn.apply(this, args);
      }
   };
}
