import React, {PropTypes} from 'react';
import look, {StyleSheet} from 'react-look';
import {textOverflow} from 'universal/styles/helpers';
import theme from 'universal/styles/theme';
import layoutStyle from 'universal/styles/layout';
import actionUIMark from 'universal/styles/theme/images/brand/mark-color.svg';
import PlaceholderList from 'universal/modules/meeting/components/PlaceholderList/PlaceholderList';
import PlaceholderAddLink from 'universal/modules/meeting/components/PlaceholderAddLink/PlaceholderAddLink';
import PlaceholderInput from 'universal/modules/meeting/components/PlaceholderInput/PlaceholderInput';
import {cashay} from 'cashay';
import {CHECKIN, UPDATES, AGENDA, SUMMARY, phaseArray} from 'universal/utils/constants';
import makeMeetingUrl from 'universal/utils/makeMeetingUrl';

const combineStyles = StyleSheet.combineStyles;
const labels = {
  lobby: 'Lobby',
  checkin: 'Check-In',
  updates: 'Updates',
  agenda: 'Agenda',
  summary: 'Summary',
};

let s = {};

const Sidebar = (props) => {
  const {
    facilitatorPhase,
    localPhase,
    teamName,
    timerValue,
    teamId
  } = props;
  const shortUrl = makeMeetingUrl(teamId);
  const facilitatorPhaseItemStyles = combineStyles(s.navListItem, s.navListItemMeetingMarker);
  const activeNavAnchor = combineStyles(s.navListItemLink, s.navListItemLinkActive);

  const checkinLinkStyles = localPhase === CHECKIN ? activeNavAnchor : s.navListItemLink;
  const updatesLinkStyles = localPhase === UPDATES ? activeNavAnchor : s.navListItemLink;
  const requestsLinkStyles = localPhase === AGENDA ? activeNavAnchor : s.navListItemLink;

  const checkinNavItemStyles = facilitatorPhase === CHECKIN ? facilitatorPhaseItemStyles : s.navListItem;
  const updatesNavItemStyles = facilitatorPhase === UPDATES ? facilitatorPhaseItemStyles : s.navListItem;
  const requestsNavItemStyles = facilitatorPhase === AGENDA ? facilitatorPhaseItemStyles : s.navListItem;

  const handleLogoClick = (e) => {
    // TODO remove in production, but great for debugging. Just click the logo & it removes the ephemeral meeting state
    e.preventDefault();
    cashay.mutate('killMeeting', {variables: {teamId}});
  };
  return (
    <div className={s.sidebar}>
      <div className={s.sidebarHeader}>
        <a className={s.brandLink} onClick={handleLogoClick}>
          <img className={s.brandLogo} src={actionUIMark}/>
        </a>
        <div className={s.teamName}>{teamName}</div>
        <a className={s.shortUrl} href="/meetingLayout/lobby">{shortUrl}</a>
        {/* TODO: make me respond to props */}
        <div className={s.timer}>{timerValue}</div>
      </div>

      {/* TODO: make me respond to props */}
      <nav className={s.nav}>
        <ul className={s.navList}>
          <li className={checkinNavItemStyles}>
            <a
              className={checkinLinkStyles}
              href={`/meeting/${teamId}/checkin`}
              title={labels.checkin}
            >
              <span className={s.bullet}>i.</span>
              <span className={s.label}>{labels.checkin}</span>
            </a>
          </li>
          <li className={updatesNavItemStyles}>
            <a
              className={updatesLinkStyles}
              href={`/meeting/${teamId}/updates`}
              title={labels.updates}
            >
              <span className={s.bullet}>ii.</span>
              <span className={s.label}>{labels.updates}</span>
            </a>
          </li>
          <li className={requestsNavItemStyles}>
            <a
              className={requestsLinkStyles}
              href={`/meeting/${teamId}/agenda`}
              title={labels.agenda}
            >
              <span className={s.bullet}>iii.</span>
              <span className={s.label}>{labels.agenda}</span>
            </a>
          </li>
          {localPhase === SUMMARY &&
            <li className={combineStyles(s.navListItem, s.navListItemLinkActive)}>
              <a
                className={combineStyles(s.navListItemLink, s.navListItemLinkActive)}
                href={`/meeting/${teamId}/summary`}
                title={labels.summary}
              >
                <span className={s.bullet}>{' '}</span>
                <span className={s.label}>{labels.summary}</span>
              </a>
            </li>
          }
        </ul>
        {localPhase !== CHECKIN && localPhase !== SUMMARY &&
          <div>{/* div for JSX */}
            <PlaceholderList />
            {/* TODO: Toggle PlaceholderAddLink and PlaceholderInput (TA) */}
            <PlaceholderAddLink />
            <PlaceholderInput />
          </div>
        }
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  facilitatorPhase: PropTypes.oneOf(phaseArray),
  localPhase: PropTypes.oneOf(phaseArray),
  teamName: PropTypes.string,
  teamId: PropTypes.string,
  timerValue: PropTypes.string
};

s = StyleSheet.create({
  brandLogo: {
    display: 'block',
    height: 'auto',
    width: '100%'
  },

  brandLink: {
    display: 'block',
    height: 'auto',
    left: '1.25rem',
    position: 'absolute',
    width: '1.9375rem'
  },

  bullet: {
    display: 'inline-block',
    fontSize: theme.typography.s4,
    marginRight: '.75rem',
    textAlign: 'right',
    verticalAlign: 'middle',
    width: '3.25rem'
  },

  label: {
    display: 'inline-block',
    fontSize: theme.typography.s4,
    verticalAlign: 'middle'
  },

  nav: {
    margin: '2rem 0',
  },

  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  navListItem: {
    fontSize: 0,
    fontWeight: 700,
    lineHeight: '2.5rem'
  },

  navListItemLink: {
    color: theme.palette.dark60l,
    textDecoration: 'none',

    ':hover': {
      color: theme.palette.dark
    }
  },

  navListItemMeetingMarker: {
    position: 'relative',

    '::after': {
      backgroundColor: theme.palette.warm,
      borderRadius: '100%',
      display: 'block',
      content: '""',
      height: '.75rem',
      marginTop: '-.375rem',
      position: 'absolute',
      right: '-.375rem',
      top: '50%',
      width: '.75rem'
    }
  },

  navListItemLinkActive: {
    color: theme.palette.dark
  },

  sidebar: {
    backgroundColor: theme.palette.dark10l,
    padding: '2rem 0',
    width: layoutStyle.meetingSidebarWidth
  },

  sidebarHeader: {
    paddingLeft: '4rem',
    position: 'relative'
  },

  shortUrl: {
    ...textOverflow,
    color: theme.palette.dark10d,
    display: 'block',
    fontSize: theme.typography.s2,
    lineHeight: 'normal',
    marginBottom: '.625rem',
    paddingRight: '.5rem',
    textDecoration: 'none',

    ':hover': {
      color: theme.palette.dark
    },
    ':focus': {
      color: theme.palette.dark
    }
  },

  teamName: {
    color: theme.palette.cool,
    fontFamily: theme.typography.serif,
    fontSize: theme.typography.s5,
    fontStyle: 'italic',
    fontWeight: 700,
    lineHeight: 'normal',
    marginBottom: '.5rem'
  },

  timer: {
    color: theme.palette.warm,
    fontFamily: theme.typography.monospace,
    fontSize: theme.typography.s4,
  }
});

export default look(Sidebar);