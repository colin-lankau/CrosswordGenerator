export const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
  
export const range = (start, end, step = 1) => {
    let output = [];
    if (typeof end === 'undefined') {
        end = start;
        start = 0;
    }
    for (let i = start; i < end; i += step) {
        output.push(i);
    }
    return output;
};

export const daysOfWeek = 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'.split(',');

export const validchars = 'q,w,e,r,t,y,u,i,o,p,l,k,j,h,g,f,d,s,a,m,n,b,v,c,x,z'.split(",");