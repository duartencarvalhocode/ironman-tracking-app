import dayjs, { Dayjs } from "dayjs"

export function dayjsToSeconds(durationDate: string | Dayjs): number {
    const duration = dayjs(durationDate)
    const hours = duration.hour()
    const minutes = duration.minute()
    const seconds = duration.second()
    return hours * 3600 + minutes * 60 + seconds
}

export function secondsToDayJs(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - 3600 * hours) / 60)
    const secondsLeft = seconds - 3600 * hours - 60 * minutes

    return dayjs().set('hour', hours).set('minute', minutes).set('second', secondsLeft)
}

export function getFormattedPace(duration: Dayjs, distance: number): string {
    const hours = duration.hour()
    const minutes = duration.minute()
    const seconds = duration.second()

    const totalMinutes = (hours * 60) + minutes + (seconds / 60)
    const pace = totalMinutes / distance

    const paceMinutes = Math.floor(pace)
    const paceSeconds = Math.round((pace - paceMinutes) * 60)

    return `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"/km`
}

