export async function getSecuritiesData() {
  //temporarily using local host, will need to change to the AWS location
  const response = await fetch(
    "https://g3amedujs2.execute-api.eu-west-2.amazonaws.com/dev/api/securities-v2"
  );
  const securities = await response.json();
  return securities;
}
