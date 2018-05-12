const calcElapsedTime = start => {
  const now = Number(new Date());
  let elapsedSecs = Math.round((now - start) / 1000);

  const hrs = Math.floor(elapsedSecs / (60 * 60));
  elapsedSecs -= hrs * (60 * 60);

  const mins = Math.floor(elapsedSecs / 60);
  elapsedSecs -= mins * 60;

  const secs = elapsedSecs;

  const [hStr, mStr, sStr] = [hrs, mins, secs].map(t => {
    let strT = String(t);
    if (strT.length < 2) {
      strT = `0${t}`;
    }
    return strT;
  });

  return `${hStr}:${mStr}:${sStr}`;
};

export default calcElapsedTime;
