import m from 'mithril';
import dataSynergies from '../data/synergies.js';
import { requestRender } from '../util/animation.js';
import roster from './roster.js';
import build from './teams/build.js';

const presets = {
    'offensive': {
        'effect-attack': 0.6,
        'effect-stun': 0.5,
        'effect-critrate': 0.4,
        'effect-critdamage': 0.4,
        'effect-powergain': 0.2,
        'effect-powersteal': 0.2,
        'effect-perfectblock': 0.1,
        'effect-block': 0.1,
        'effect-armor': 0.1,
        'effect-health': 0.1,
        'effect-healthsteal': 0.2,
    },
    'balanced': {
        'effect-attack': 0.5,
        'effect-stun': 0.5,
        'effect-critrate': 0.5,
        'effect-critdamage': 0.5,
        'effect-powergain': 0.5,
        'effect-powersteal': 0.5,
        'effect-perfectblock': 0.5,
        'effect-block': 0.5,
        'effect-armor': 0.5,
        'effect-health': 0.5,
        'effect-healthsteal': 0.5,
    },
    'defensive': {
        'effect-attack': 0.1,
        'effect-stun': 0.5,
        'effect-critrate': 0.1,
        'effect-critdamage': 0.1,
        'effect-powergain': 0.3,
        'effect-powersteal': 0.3,
        'effect-perfectblock': 0.8,
        'effect-block': 0.7,
        'effect-armor': 0.7,
        'effect-health': 0.5,
        'effect-healthsteal': 0.5,
    },
};


const teams = {
    type: 'arena',
    size: 3,
    stars: {
        1: false,
        2: true,
        3: true,
        4: false,
        5: false,
    },
    weights: {
        'duplicates-2': 0.8,
        'duplicates-3': 0.4,
        'duplicates-4': 0.2,
        'duplicates-5': 0.1,
        ...presets[ 'offensive' ],
    },
    progress: 0,
    building: false,
};

function fidToRosterChampion(fid) {
    /* eslint-disable eqeqeq */
    const [ uid, stars ] = fid.split('-');
    return roster.filter((champion) =>
        champion.attr.uid === uid && champion.attr.stars == stars
    )[ 0 ];
    /* eslint-enable eqeqeq */
}

function buildTeams() {
    teams.building = true;
    const result = build({
        type: teams.type,
        champions: roster
            .filter((champion) => teams.stars[ champion.attr.stars ])
            .map((champion) => champion.id()),
        size: teams.size,
        weights: {
            ...teams.weights,
        },
        progress: (current, max) => {
            requestRender('progress', () => {
                teams.progress = current / max;
                m.redraw();
            });
        },
    });
    let teamsCount = 0;
    let synergiesCount = 0;
    teams.result = {
        ...result,
        teams: result.teams.map((team) => {
            const champions = team.map(fidToRosterChampion);
            const synergies = dataSynergies.filter((synergy) => {
                const { fromId, fromStars, toId } = synergy.attr;
                if(!champions.find(({ attr }) => fromId === attr.uid && fromStars === attr.stars))
                    return false;
                return Boolean(champions.find(({ attr }) => toId === attr.uid));

            });
            teamsCount++;
            synergiesCount += synergies.length;
            return {
                champions,
                synergies,
            };
        }),
        counts: {
            teams: teamsCount,
            synergies: synergiesCount,
        },
        extras: result.extras.map(fidToRosterChampion),

    };
    teams.building = false;
    m.redraw();
}

export { presets, buildTeams };
export default teams;
