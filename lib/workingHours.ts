export interface WorkingHoursConfig {
    working_hours_enabled?: boolean | string;
    working_hours_start?: string;
    working_hours_end?: string;
    working_hours_timezone?: string;
    working_hours_status?: 'auto' | 'force_open' | 'force_closed' | string;
    working_hours_notice?: string;
}

export interface WorkingHoursCheckResult {
    isOpen: boolean;
    isEnabled: boolean;
    start: string;
    end: string;
    timezone: string;
    status: 'auto' | 'force_open' | 'force_closed';
    notice: string;
    currentTimeInZone: string;
    nextOpenDescription: string;
}

/**
 * Checks whether the current system time falls within the configured operational working hours.
 */
export function checkWorkingHours(config: WorkingHoursConfig, referenceDate: Date = new Date()): WorkingHoursCheckResult {
    const isEnabled = config.working_hours_enabled === true || config.working_hours_enabled === 'true';
    const start = config.working_hours_start || '10:00';
    const end = config.working_hours_end || '22:00';
    const timezone = config.working_hours_timezone || 'UTC';
    const status = (config.working_hours_status as 'auto' | 'force_open' | 'force_closed') || 'auto';
    const defaultNotice = `The optimization network is currently closed outside operational working hours. Working hours are ${start} – ${end} (${timezone}). Deposits and withdrawals remain accessible 24/7. Customer Service will resume in the morning.`;
    const notice = config.working_hours_notice || defaultNotice;

    // Get time in target timezone
    let currentHour = referenceDate.getUTCHours();
    let currentMinute = referenceDate.getUTCMinutes();
    let currentTimeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }).formatToParts(referenceDate);

        const hPart = parts.find(p => p.type === 'hour');
        const mPart = parts.find(p => p.type === 'minute');

        if (hPart && mPart) {
            currentHour = parseInt(hPart.value, 10);
            currentMinute = parseInt(mPart.value, 10);
            // In 24-hr format, 24 can sometimes be returned by browsers
            if (currentHour === 24) currentHour = 0;
            currentTimeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        }
    } catch {
        // Fallback to UTC if timezone string is invalid
    }

    const currentMinutes = currentHour * 60 + currentMinute;

    const [startH, startM] = start.split(':').map(v => parseInt(v, 10) || 0);
    const [endH, endM] = end.split(':').map(v => parseInt(v, 10) || 0);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    let isOpen = true;

    if (!isEnabled) {
        isOpen = true;
    } else if (status === 'force_open') {
        isOpen = true;
    } else if (status === 'force_closed') {
        isOpen = false;
    } else {
        // Auto mode
        if (startMinutes < endMinutes) {
            // Normal daylight shift (e.g. 10:00 to 22:00)
            isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;
        } else if (startMinutes > endMinutes) {
            // Overnight shift (e.g. 20:00 to 04:00)
            isOpen = currentMinutes >= startMinutes || currentMinutes < endMinutes;
        } else {
            // start == end, open 24/7
            isOpen = true;
        }
    }

    const nextOpenDescription = isOpen
        ? `Open now until ${end} (${timezone})`
        : `Closed now • Opens at ${start} (${timezone})`;

    return {
        isOpen,
        isEnabled,
        start,
        end,
        timezone,
        status,
        notice,
        currentTimeInZone: currentTimeFormatted,
        nextOpenDescription
    };
}
