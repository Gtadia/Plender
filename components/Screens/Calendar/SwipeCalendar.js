import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { For, Memo, Reactive, Show } from "@legendapp/state/react";
import { batch, observe } from "@legendapp/state";
import { swipeableCalendar$ } from '../../../db/LegendApp';

import isoWeek from 'dayjs/plugin/isoWeek' // ES 2015

dayjs.extend(isoWeek);

windowWidth = Dimensions.get('window').width;
windowHeight = Dimensions.get('window').height;

// todo — option to change between monday as the first day (start: dayjs(date).startOf('isoWeek').clone().subtract(1, "day"))
const getWeek = (date) => {
	const data = {
		start: dayjs(date).startOf('isoWeek'),
		end: dayjs(date).endOf('isoWeek')
	};
	let day = data.start;
	let days = [];
	while (day <= data.end) {
		days = [ ...days, day ];
		day = day.clone().add(1, 'day');
	}
	return days;
};

//TODO merge this two functions into one
const getShowingHeaderItems = (week, format) => {
	const firstVar = dayjs(week[0]).format(format);
	const lastVar = dayjs(week[week.length - 1]).format(format);

	if (firstVar === lastVar) {
		return firstVar;
	}

	return firstVar + '/' + lastVar;
};

class SwipeCalendar extends Component {
	state = {
		weeks: null,
		activeDay: null,
		pages: [ '-1', '0', '1' ],
		key: 0,
		showingMonths: '',
		showingYears: ''
	};

	static defaultProps = {
		startingDate: dayjs(),
		secondaryColor: 'steelblue',
		backgroundColor: '#fff',
		height: 100,
		showMonth: true,
		showYear: true,
	};

	componentDidMount() {
		if (this.props.onMount !== undefined) {
			this.props.onMount();
		}
		const weeks = this.getWeeks(this.props.startingDate);

		batch(() => {
			swipeableCalendar$.weeks.set(this.getWeeks(this.props.startingDate));
			swipeableCalendar$.activeDay.set(dayjs());
			swipeableCalendar$.showingMonths.set(getShowingHeaderItems(weeks[swipeableCalendar$.pages[1].get()], 'MMMM'));
			swipeableCalendar$.showingYears.set(getShowingHeaderItems(weeks[swipeableCalendar$.pages[1].get()], 'YYYY'));
		})
	}

	getWeeks = (date) => {
		const weeks = {
			[parseInt(swipeableCalendar$.pages[0].get()) - 1]: getWeek(dayjs(date).subtract(2, 'weeks')),
			[swipeableCalendar$.pages[0].get()]: getWeek(dayjs(date).subtract(1, 'weeks')),
			[swipeableCalendar$.pages[1].get()]: getWeek(dayjs(date)),
			[swipeableCalendar$.pages[2].get()]: getWeek(dayjs(date).add(1, 'weeks')),
			[parseInt(swipeableCalendar$.pages[2].get()) + 1]: getWeek(dayjs(date).add(2, 'weeks'))
		};

		return weeks;
	};

	dayPressedHandler = (day) => {
		// batch(() => {
		swipeableCalendar$.activeDay.set(day)
		// })

		if (this.props.dayPressed !== undefined) {
			this.props.dayPressed(day);
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.activeDay !== this.props.activeDay) {
			this.handleActiveDayChange();
		}
		// swipeableCalendar$.keys.set((prev) => prev + 1)

		// observe(() => {
		// 	console.log("This is an update: ")
		// 	console.log(swipeableCalendar$.keys.get())
		// 	if (swipeableCalendar$.keys.get() == 0) {
		// 		console.log(swipeableCalendar$.weeks.get());
		// 	}
		// })
	}

	handleActiveDayChange = (date) => {
		const activeWeekNumber = swipeableCalendar$.weeks[swipeableCalendar$.pages[1].get()][3].get().format('W');
		const activeDayWeekNumber = this.props.activeDay.format('W');

		if (activeWeekNumber === activeDayWeekNumber) {
			// batch(() => {
				swipeableCalendar$.activeDay.set(this.props.activeDay)
			// });
		}
		if (activeDayWeekNumber - activeWeekNumber === 1 || activeDayWeekNumber - activeWeekNumber === -1) {
			//this.swiper.scrollBy(activeDayWeekNumber - activeWeekNumber + 1, true);
			this.swiperScrollHandler(activeDayWeekNumber - activeWeekNumber + 1);
			batch(() => {
				swipeableCalendar$.activeDay.set(this.props.activeDay)
			});
		}
		if (Math.abs(activeDayWeekNumber - activeWeekNumber) > 1) {
			const weeks = this.getWeeks(this.props.activeDay);
			batch(() => {
				swipeableCalendar$.weeks.set(weeks);
				swipeableCalendar$.activeDay.set(this.props.activeDay);
				swipeableCalendar$.showingMonths.set(getShowingHeaderItems(weeks[swipeableCalendar$.pages[1].get()], 'MMMM'));
				swipeableCalendar$.showingYears.set(getShowingHeaderItems(weeks[swipeableCalendar$.pages[1].get()], 'YYYY'));
			});
		}
	};

	swiperScrollHandler = (index) => {
		if (this.props.calendarSwiped !== undefined) {
			this.props.calendarSwiped(index);
		}
		if (index === 0) {
			const newPages = swipeableCalendar$.pages.get().map((e) => (parseInt(e) - 1).toString());
			const newKey = swipeableCalendar$.key.get() + 1;
			let weeksObjKeys = Object.keys(swipeableCalendar$.weeks.get());
			const nextKey = Math.min(...weeksObjKeys) - 1;
			const deleteKey = Math.max(...weeksObjKeys);

			weeks = {
				...swipeableCalendar$.weeks.get(),
				[nextKey]: getWeek(dayjs(swipeableCalendar$.weeks[swipeableCalendar$.pages[1].get()][3].get()).subtract(3, 'weeks'))
			};

			delete weeks[deleteKey];

			const newActiveDay = dayjs(swipeableCalendar$.activeDay.get()).subtract(1, 'weeks');

			batch(() => {
				swipeableCalendar$.key.set(newKey);
				swipeableCalendar$.pages.set(newPages);
				swipeableCalendar$.weeks.set(weeks);
				// swipeableCalendar$.activeDay.set(newActiveDay);
				swipeableCalendar$.showingMonths.set(getShowingHeaderItems(weeks[newPages[1]], 'MMMM'));
			});
		} else if (index === 2) {
			const newPages = swipeableCalendar$.pages.get().map((e) => (parseInt(e) + 1).toString());
			const newKey = swipeableCalendar$.key.get() + 1;
			let weeksObjKeys = Object.keys(swipeableCalendar$.weeks.get());
			const nextKey = Math.max(...weeksObjKeys) + 1;
			const deleteKey = Math.min(...weeksObjKeys);

			weeks = {
				...swipeableCalendar$.weeks.get(),
				[nextKey]: getWeek(dayjs(swipeableCalendar$.weeks[swipeableCalendar$.pages[1].get()][3].get()).add(3, 'weeks'))
			};

			delete weeks[deleteKey];

			const newActiveDay = dayjs(swipeableCalendar$.activeDay.get()).add(1, 'weeks');

			batch(() => {
				swipeableCalendar$.key.set(newKey);
				swipeableCalendar$.pages.set(newPages);
				swipeableCalendar$.weeks.set(weeks);
				// swipeableCalendar$.activeDay.set(newActiveDay);
				swipeableCalendar$.showingMonths.set(getShowingHeaderItems(weeks[newPages[1]], 'MMMM'));
				swipeableCalendar$.showingYears.set(getShowingHeaderItems(weeks[newPages[1]], 'YYYY'))
			});
		}
	};

	render() {
		return (
			<View style={[ { height: this.props.height }, { ...this.props.style } ]}>
				<Memo>
					{() =>
				<Header
					headerStyle={this.props.headerStyle}
					headerText={this.props.headerText}
					showingMonths={swipeableCalendar$.showingMonths.get()}
					showingYears={swipeableCalendar$.showingYears.get()}
					showYear={this.props.showYear}
					showMonth={this.props.showMonth}
				/>
					}
				</Memo>

				<Show if={() => swipeableCalendar$.weeks.get() !== null} else={<></>}>
					{() =>
						<Memo>
							{() =>
								<Swiper
									ref={(ref) => (this.swiper = ref)}
									key={swipeableCalendar$.key.get()}
									onIndexChanged={this.swiperScrollHandler}
									showsPagination={false}
									loop={false}
									index={1}
								>
									{swipeableCalendar$.pages.get().map((page, index) => {
										return (
											<View key={index} style={{ flexDirection: 'row', justifyContent:'center' }}>
												{swipeableCalendar$.weeks[page].get().map((day, index) => {
													return (
														<Day
															click={() => this.dayPressedHandler(day)}
															active={
																dayjs(day).format('MM-DD-YYYY') ===
																swipeableCalendar$.activeDay.get().format('MM-DD-YYYY')
															}
															key={index}
															dayNumber={dayjs(day).format('D')}
															dayInWeekName={dayjs(day).format('ddd')}
															dateNameStyle={this.props.dateNameStyle}
															dateNumberStyle={this.props.dateNumberStyle}
														/>
													);
												})}
											</View>
										);
									})}
								</Swiper>
							}
						</Memo>
					}
				</Show>
			</View>
		);
	}
}

const Day = (props) => {
	return (
		<TouchableOpacity
			onPress={props.click}
			style={[ styles.Day, props.active ? { backgroundColor: "black" } : null ]}
		>
			<Text style={[ { color: props.active ? 'white': 'black', fontSize: 18, fontWeight: "bold", marginBottom: 4, }, { ...props.dateNameStyle } ]}>
				{props.dayInWeekName}
			</Text>
			<Text style={[ { color: props.active ? 'white': 'black', fontSize: 18, fontWeight: "bold" }, { ...props.dateNumberStyle } ]}>{props.dayNumber}</Text>
		</TouchableOpacity>
	);
};

const Header = (props) => {
	let spaceBetweenMonthAndYear = false;
	if (props.showMonth && props.showYear) {
		spaceBetweenMonthAndYear = true;
	}
	return (
		<View style={[ styles.HeaderWrapper, { ...props.headerStyle } ]}>
			{props.showMonth ? (
				<Text style={[ styles.HeaderText, { ...props.headerText } ]}>{props.showingMonths}</Text>
			) : null}
			{spaceBetweenMonthAndYear ? <Text> </Text> : null}
			{props.showYear ? (
				<Text style={[ styles.HeaderText, { ...props.headerText } ]}>{props.showingYears}</Text>
			) : null}
		</View>
	);
};

SwipeCalendar.propTypes = {
	startingDate: PropTypes.instanceOf(dayjs),
	height: PropTypes.number,
	showHeader: PropTypes.bool,
	showYear: PropTypes.bool,

	dayPressed: PropTypes.func,
	calendarSwiped: PropTypes.func,
	onMount: PropTypes.func
};

const styles = StyleSheet.create({
	Day: {
		width: ((windowWidth * 0.9) / 7) - 4 * 2,
		marginHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
		borderRadius: 10,
		height: 65,
	},
	HeaderWrapper: {
		justifyContent: 'center',
		paddingTop: 5,
		paddingBottom: 8,
		flexDirection: 'row'
	},
	HeaderText: {
		fontSize: 15,
		color: 'rgba(0, 0, 0, .8)',
		fontWeight: "bold",
	}
});

export default SwipeCalendar;