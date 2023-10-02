export async function searchStreet(
  axios,
  number,
  streetName,
  postCode = '',
  city = '',
  province = '',
  country = 'España'
) {
  try {
    const q = [streetName, number, postCode, city, province, country]
      .filter(v => v)
      .join(',')
    const url = `api/geo_proxy/ubication/search/?q=${q}, `
    const address = await axios.get(url)
    return address.data
  } catch (error) {
    console.log({ error })
  }
  return {
    lat: address.geometry.coordinates[0],
    lng: address.geometry.coordinates[1],
  }
}

export async function searchStreetReverse(axios, latitude, longitude) {
  try {
    const url = `api/geo_proxy/ubication/reverse/?lat=${latitude}&lon=${longitude}`
    const response = await axios.get(url)
    return {
      ...response.data,
      latitude,
      longitude,
      lat: latitude,
      lon: longitude,
    }
  } catch (error) {
    console.log({ error })
  }
}
