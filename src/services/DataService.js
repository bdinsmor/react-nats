import firebaseApp from './firebase-setup';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import dayjs from 'dayjs';
import moment from 'moment';
import { getFirestore, collection, doc, orderBy, query, onSnapshot, where, getDocs, setDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);
const playersDb = collection(db, 'players');
const lineupsDb = collection(db, 'lineups');
const positionsDb = collection(db, 'positions');

const lineupsSubj = new Subject();

// this will be used to allow lineups.js to subscribe to changes in lineups and then prompt user for refresh
export const lineupsSubject = {
  notify: (lineups) => lineupsSubj.next(lineups),
  clear: () => lineupsSubj.next(),
  getLineups: () => lineupsSubj.asObservable(),
};

const positionsSubj = new Subject();

// this will be used to allow lineups.js to subscribe to changes in lineups and then prompt user for refresh
export const positionsSubject = {
  notify: (lineups) => positionsSubj.next(lineups),
  clear: () => positionsSubj.next(),
  getPositions: () => positionsSubj.asObservable(),
};

const playersSubj = new Subject();

// this will be used to allow lineups.js to subscribe to changes in lineups and then prompt user for refresh
export const playersSubject = {
  notify: (lineups) => playersSubj.next(lineups),
  clear: () => playersSubj.next(),
  getPlayers: () => playersSubj.asObservable(),
};

const daysUntil = (date) => {
  var birthday = moment(date);

  // uncomment this line to simulate it is your birthday and comment the next one to test it.
  // var today = moment("2017-03-25");
  var today = moment().format('YYYY-MM-DD');

  // calculate age of the person
  var age = moment(today).diff(birthday, 'years');
  moment(age).format('YYYY-MM-DD');

  var nextBirthday = moment(birthday).add(age, 'years');
  moment(nextBirthday).format('YYYY-MM-DD');

  /* added one more year in case the birthday has already passed
  to calculate date till next one. */
  if (nextBirthday.isSame(today)) {
    return 0;
  } else {
    nextBirthday = moment(birthday).add(age + 1, 'years');
    return nextBirthday.diff(today, 'days');
  }
};

const sortLineups = (lineups) => {
  const lineupsByDate = {};
  let sortedLineups = [];
  lineups.forEach((lineup) => {
    lineup.key = lineup.id;

    const date = lineup.date;
    const year = dayjs(new Date(date)).year();
    const mth = year + ' ' + dayjs(new Date(date)).month();
    const month = dayjs(new Date(date)).format('MMMM');
    if (!lineupsByDate[mth]) {
      lineupsByDate[mth] = {
        month: month + ' ' + year,
        lineups: [lineup],
      };
    } else {
      lineupsByDate[mth].lineups.push(lineup);
    }
  });
  Object.keys(lineupsByDate).forEach(function (key, index) {
    let monthLineups = lineupsByDate[key].lineups;
    monthLineups = monthLineups
      .sort((o) => {
        return new Date(o.date);
      })
      .reverse();
    sortedLineups.push({
      key: uuidv4(),
      mth: key,
      month: lineupsByDate[key].month,
      lineups: monthLineups,
    });
  });
  sortedLineups = sortedLineups
    .sort((o) => {
      return o.mth;
    })
    .reverse();
  return sortedLineups;
};

const DataService = {
  // LINEUPS
  async formatLineups(docs) {
    const lineups = docs.map((lineup) => {
      try {
        lineup.date = moment(lineup.date, 'MM/DD/YYYY');
      } catch (err) {
        console.log('caught error: ', err);
      }
      return lineup;
    });
    //console.log('formatted: ' + JSON.stringify(lineups, null, 2));
    return sortLineups(lineups);
  },
  async getLineups(season, year) {
    // can't figure out why passing in the constiables isn't working...
    const q = query(lineupsDb, where('year', '==', 2021), where('season', '==', 'fall'), orderBy('date'));

    const res = await getDocs(q);
    const lineups = res.docs.map((doc) => {
      const lineup = doc.data();
      try {
        lineup.date = moment(lineup.date, 'MM/DD/YYYY');
      } catch (err) {
        console.log('caught error: ', err);
      }
      return lineup;
    });
    return sortLineups(lineups);
  },

  async subscribeToLineups(season, year) {
    const q = query(lineupsDb, where('year', '==', 2021), where('season', '==', 'fall'), orderBy('date'));
    const unsubscribe = onSnapshot(q, (lineupsSnapshot) => {
      const lineups = lineupsSnapshot.docs.map((doc) => {
        const lineup = doc.data();
        try {
          lineup.date = moment(lineup.date, 'MM/DD/YYYY');
        } catch (err) {
          console.log('caught error: ', err);
        }
        return lineup;
      });
      const lineupsByDate = {};
      let sortedLineups = [];
      lineups.forEach((lineup) => {
        lineup.key = lineup.id;

        const date = lineup.date;
        const year = dayjs(new Date(date)).year();
        const mth = year + ' ' + dayjs(new Date(date)).month();
        const month = dayjs(new Date(date)).format('MMMM');
        if (!lineupsByDate[mth]) {
          lineupsByDate[mth] = {
            month: month + ' ' + year,
            lineups: [lineup],
          };
        } else {
          lineupsByDate[mth].lineups.push(lineup);
        }
      });
      Object.keys(lineupsByDate).forEach(function (key, index) {
        let monthLineups = lineupsByDate[key].lineups;
        monthLineups = monthLineups
          .sort((o) => {
            return new Date(o.date);
          })
          .reverse();
        sortedLineups.push({
          key: uuidv4(),
          mth: key,
          month: lineupsByDate[key].month,
          lineups: monthLineups,
        });
      });
      sortedLineups = sortedLineups
        .sort((o) => {
          return o.mth;
        })
        .reverse();
      lineupsSubject.notify(sortedLineups);
    });
    return () => unsubscribe();
  },

  async getLineup(lineupId) {
    return await lineupsDb.doc(lineupId);
  },

  async updateLineup(lineup) {
    if (!lineup.id) {
      lineup.id = uuidv4();
    }
    try {
      const ref = doc(db, 'lineups', lineup.id);
      lineup.date = dayjs(lineup.date).format('MM/DD/YYYY');
      await setDoc(ref, lineup);
    } catch (err) {
      console.error('caught error: ', err, JSON.stringify(lineup, null, 2));
    }
  },

  async deleteLineup(lineupId) {
    return await lineupsDb.doc(lineupId).delete();
  },

  async subscribeToPositions() {
    const q = query(positionsDb, orderBy('number'));
    const unsubscribe = onSnapshot(q, (lineupsSnapshot) => {
      const positions = lineupsSnapshot.docs.map((doc) => {
        return doc.data();
      });
      positionsSubject.notify(positions);
    });
    return () => unsubscribe();
  },

  async getPositions() {
    try {
      const q = query(positionsDb, orderBy('number'));
      const res = await getDocs(q);
      return res.docs.map((doc) => doc.data());
    } catch (err) {
      console.error('caught error: ', err);
      throw err;
    }
  },

  // PLAYERS

  async subscribeToPlayers() {
    const q = query(playersDb, where('year', '==', '2021'), where('season', '==', 'fall'), orderBy('jersey'));
    const unsubscribe = onSnapshot(q, (playersSnapshot) => {
      const players = playersSnapshot.docs.map((doc) => {
        const p = doc.data();
        p.year = parseInt(p.year);
        p.daysTilBirthday = daysUntil(p.dateOfBirth);
        return p;
      });
      playersSubject.notify(players);
    });
    return () => unsubscribe();
  },

  async getPlayers(season, year) {
    try {
      const q = query(playersDb, where('year', '==', '2021'), where('season', '==', 'fall'), orderBy('jersey'));

      const playersRes = await getDocs(q);
      return playersRes.docs.map((doc) => {
        const p = doc.data();
        p.year = parseInt(p.year);
        return p;
      });
    } catch (err) {
      console.error('caught error: ', err);
      throw err;
    }
  },

  async getPlayer(playerId) {
    return await playersDb.doc(playerId);
  },

  async updatePlayer(player) {
    if (!player.id) {
      player.id = uuidv4();
    }
    const playerRef = doc(db, 'players', player.id);
    await setDoc(playerRef, player);
    await this.updateLineupsAfterPlayerUpdate(player);
  },

  async updateLineupsAfterPlayerUpdate(updatedPlayer) {
    const lineupGroups = await this.getLineups();
    for (let lineupGroup of lineupGroups) {
      let found = false;
      let lineups = lineupGroup.lineups;
      for (let lineup of lineups) {
        if (lineup.notPlaying) {
          for (let i = 0; i < lineup.notPlaying.length; i++) {
            if (lineup.notPlaying[i].id === updatedPlayer.id) {
              let player = lineup.playing[i];
              player.firstName = updatedPlayer.firstName;
              player.lastName = updatedPlayer.lastName;
              player.textColor = updatedPlayer.textColor;
              player.backgroundColor = updatedPlayer.backgroundColor;
              player.dateOfBirth = updatedPlayer.dateOfBirth;
              player.jersey = updatedPlayer.jersey;
              player.nickname = updatedPlayer.nickname;
              lineup.notPlaying[i] = player;
              lineup.notPlaying = [...lineup.notPlaying];
              found = true;
              break;
            }
          }
        }

        if (!found) {
          for (let j = 0; j < lineup.playing.length; j++) {
            if (lineup.playing[j].id === updatedPlayer.id) {
              let player = lineup.playing[j];
              console.log('will update ' + player.backgroundColor + ' to ' + updatedPlayer.backgroundColor);
              player.firstName = updatedPlayer.firstName;
              player.lastName = updatedPlayer.lastName;
              player.textColor = updatedPlayer.textColor;
              player.backgroundColor = updatedPlayer.backgroundColor;
              player.dateOfBirth = updatedPlayer.dateOfBirth;
              player.jersey = updatedPlayer.jersey;
              player.nickname = updatedPlayer.nickname;
              lineup.playing[j] = player;
              found = true;

              lineup.playing = [...lineup.playing];
              break;
            }
          }
        }
        if (found) {
          await DataService.updateLineup(lineup);
        }
      }
    }
  },

  async deletePlayer(player) {
    return await playersDb.doc(player.id).delete();
  },
};

export default DataService;
