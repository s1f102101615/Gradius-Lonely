const updatePower = (
  powerstatus: number[],
  cellcount: number,
) : [number[], number] => {
  const powerposition = ((cellcount - 1) % 6);
  if (powerposition > 0 && powerstatus[powerposition] === 1 || cellcount === 0) {
    console.log('powerup');
    return [powerstatus, cellcount];
  }
  powerstatus[powerposition] += 1
  const newpower = powerstatus;
  const newcellcount = 0;
  return [newpower, newcellcount];  
};

export default updatePower;