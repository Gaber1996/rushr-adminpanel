// Text lines for a location-history event.
import { DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

/** The backend measures the arrival gap in km; the design states it in miles. */
export function distanceLine(event) {
  if (event.distanceKm != null) {
    return TEXT.milesFromCustomer((event.distanceKm * 0.621371).toFixed(1))
  }
  return event.note || TEXT.defaultDistance
}

/**
 * Where the pro actually was. The API resolves the recorded coordinates to a street address;
 * the raw fix is the fallback for a point it could not name.
 */
export function placeLine(event) {
  if (event.address) return event.address
  if (event.latitude == null || event.longitude == null) return null
  return `${Number(event.latitude).toFixed(4)}, ${Number(event.longitude).toFixed(4)}`
}
