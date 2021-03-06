import './TeamsPage.scss';
import Message from '../Message.jsx';
import Team from '../Team.jsx';
import Champion from '../Champion.jsx';
import teams from '../../service/teams.js';
import lang from '../../service/lang.js';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const TeamsPage = {
    view(/* ctrl, args */) {
        const result = teams.result;
        let message = `0 ${ lang.get('teams') }`;
        let teamDivs;
        let extrasHeader;
        let extrasDiv;
        if(result) {
            const { counts, teams, extras } = result;
            message = `${ counts.teams } ${ lang.get('teams') } ${ lang.get('with') } ${ counts.synergies } ${ lang.get('synergies') }`;
            teamDivs = teams.map(({ champions, synergies }) => (
                <Team
                    key={ champions.map((c) => c.id()).join('-') }
                    champions={ champions }
                    synergies={ synergies }
                />
            ));
            if(extras.length) {
                extrasHeader = (
                    <h3>{ lang.get('extras') }</h3>
                );
                extrasDiv = extras.map((champion, extrasIndex) => (
                    <Champion
                        key={ `extras-${ extrasIndex }-${ champion.id() }` }
                        champion={ champion }
                    />
                ));
            }
        }
        return (
            <div class="teams">
                <Message value={ message } />
                <div>
                    { teamDivs }
                </div>
                { extrasHeader }
                <div>
                    { extrasDiv }
                </div>
            </div>
        );
    },
};

export default TeamsPage;
