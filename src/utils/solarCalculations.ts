/**
 * Utilities for calculating solar position and zenith line
 */

export interface SolarPosition {
  latitude: number;
  longitude: number;
  declination: number;
  equationOfTime: number;
}

/**
 * Calculate the solar declination angle for a given date
 * @param date The date to calculate for
 * @returns Declination angle in degrees
 */
export function calculateSolarDeclination(date: Date): number {
  const dayOfYear = getDayOfYear(date);
  // Solar declination formula
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
  return declination;
}

/**
 * Calculate the equation of time for a given date
 * @param date The date to calculate for
 * @returns Equation of time in minutes
 */
export function calculateEquationOfTime(date: Date): number {
  const dayOfYear = getDayOfYear(date);
  const B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180;
  
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  return equationOfTime;
}

/**
 * Get the day of year (1-365/366)
 * @param date The date
 * @returns Day of year
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the solar noon longitude for a given date and time
 * @param date The date and time
 * @returns Longitude where the sun is at zenith
 */
export function calculateSolarNoonLongitude(date: Date): number {
  const equationOfTime = calculateEquationOfTime(date);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const timeInHours = hours + minutes / 60;
  
  // Solar noon occurs at different longitudes throughout the day
  // 15 degrees per hour (360 degrees / 24 hours)
  const solarNoon = 12 + equationOfTime / 60; // Solar noon in hours
  const longitude = (timeInHours - solarNoon) * 15;
  
  // Normalize to -180 to 180 range
  return ((longitude + 180) % 360) - 180;
}

/**
 * Calculate the zenith line points for a given date
 * @param date The date to calculate for
 * @returns Array of latitude/longitude points where the sun is at zenith
 */
export function calculateZenithLine(date: Date): Array<{ lat: number; lng: number }> {
  const declination = calculateSolarDeclination(date);
  const points: Array<{ lat: number; lng: number }> = [];
  
  // The zenith line is at the solar declination latitude
  // and moves across all longitudes throughout the day
  for (let lng = -180; lng <= 180; lng += 1) {
    points.push({
      lat: declination,
      lng: lng
    });
  }
  
  return points;
}

/**
 * Calculate the current subsolar point (where the sun is directly overhead)
 * @param date The date and time
 * @returns The latitude and longitude of the subsolar point
 */
export function calculateSubsolarPoint(date: Date): { lat: number; lng: number } {
  const declination = calculateSolarDeclination(date);
  const longitude = calculateSolarNoonLongitude(date);
  
  return {
    lat: declination,
    lng: longitude
  };
}

/**
 * Get solar information for display
 * @param date The date to calculate for
 * @returns Solar information object
 */
export function getSolarInfo(date: Date): {
  declination: number;
  equationOfTime: number;
  subsolarPoint: { lat: number; lng: number };
  zenithLine: Array<{ lat: number; lng: number }>;
} {
  const declination = calculateSolarDeclination(date);
  const equationOfTime = calculateEquationOfTime(date);
  const subsolarPoint = calculateSubsolarPoint(date);
  const zenithLine = calculateZenithLine(date);
  
  return {
    declination,
    equationOfTime,
    subsolarPoint,
    zenithLine
  };
}
