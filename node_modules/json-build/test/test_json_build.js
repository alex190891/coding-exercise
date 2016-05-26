var assert = require('assert');

describe('JSON-Build', function () {
	var json_build = require('../index');

	describe('Construction', function () {

		it('Should return a json with a single field', function (done) {
			var expected = {
				first: 1
			};

			var actual = (new json_build())
				.addValue('first', 1)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 2 fields on the same level', function (done) {
			var expected = {
				first: 1,
				second: 2
			};

			var actual = (new json_build())
				.addValue('first', 1)
				.addValue('second', 2)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 2 nested fields', function (done) {
			var expected = {
				first: {
					second: 2
				}
			};

			var actual = (new json_build())
				.addValue('first.second', 2)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 3 nested fields', function (done) {
			var expected = {
				first: {
					second: {
						third: 3
					}
				}
			};

			var actual = (new json_build())
				.addValue('first.second.third', 3)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 2 fields and 1 nested', function (done) {
			var expected = {
				first: {
					second: 2
				},
				third: 3
			};

			var actual = (new json_build())
				.addValue('first.second', 2)
				.addValue('third', 3)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 1 nested field with 2 fields', function (done) {
			var expected = {
				first: {
					second: 2,
					third: 3
				},
			};

			var actual = (new json_build())
				.addValue('first.second', 2)
				.addValue('first.third', 3)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 1 nested field with 2 fields, overwriting one of them', function (done) {
			var expected = {
				first: {
					second: 2,
					third: 2
				},
			};

			var actual = (new json_build())
				.addValue('first.second', 2)
				.addValue('first.third', 3)
				.addValue('first.third', 2)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 1 nested field with 2 fields, overwriting one of them with another object', function (done) {
			var expected = {
				first: {
					second: 2,
					third: {
						fourth: 4
					}
				},
			};

			var actual = (new json_build())
				.addValue('first.second', 2)
				.addValue('first.third', 3)
				.addValue('first.third.fourth', 4)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json without nested fields with an array with 2 items', function (done) {
			var expected = {
				first: [1, 2]
			};

			var actual = (new json_build())
				.pushValue('first', 1)
				.pushValue('first', 2)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 1 nested field with an array with 2 items', function (done) {
			var expected = {
				first: {
					second: [1, 2]
				},
			};

			var actual = (new json_build())
				.pushValue('first.second', 1)
				.pushValue('first.second', 2)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 2 nested field with an array with 2 items', function (done) {
			var expected = {
				first: {
					second: [1, 2],
					third: 3
				},
			};

			var actual = (new json_build())
				.pushValue('first.second', 1)
				.pushValue('first.second', 2)
				.addValue('first.third', 3)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return a json with 2 nested fields with an array with 2 items and another nesting with an array of 1 element', function (done) {
			var expected = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4]
					}
				},
			};

			var actual = (new json_build())
				.pushValue('first.second', 1)
				.pushValue('first.second', 2)
				.pushValue('first.third.fourth', 4)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return an unchanged object using a base object', function (done) {
			var expected = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4]
					}
				},
			};

			var actual = (new json_build(expected))
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return the same object with a nested fifth object when using a base object', function (done) {
			var expected = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4],
						fifth: 5
					}
				}
			};

			var actual = (new json_build(expected))
				.addValue('first.third.fifth', 5)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return an unchanged object using a base object', function (done) {
			var expected = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4],
						fifth: [5]
					}
				}
			};

			var initial = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4]
					}
				}
			};

			var actual = (new json_build(initial))
				.pushValue('first.third.fifth', 5)
				.build();
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});
	});

	describe('Examination', function () {
		it('Should return undefined', function (done) {
			var expected = undefined;

			var initial = {
				first: {
					second: [1, 2],
					third: {
						fourth: [4]
					}
				}
			};

			var actual = (new json_build(initial))
				.get('first.third.fifth');
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return 2', function (done) {
			var expected = 2;

			var initial = {
				first: {
					second: 2
				}
			};

			var actual = (new json_build(initial))
				.get('first.second');
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return 3', function (done) {
			var expected = 3;

			var initial = {
				first: {
					second: 2,
					third: 3
				}
			};

			var actual = (new json_build(initial))
				.get('first.third');
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return 3', function (done) {
			var expected = 3;

			var initial = {
				first: {
					second: {
						third: 3
					}
				}
			};

			var actual = (new json_build(initial))
				.get('first.second.third');
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});

		it('Should return 3', function (done) {
			var expected = 'sdliweoiruwir';

			var req = {
				body: {
					bankcarddetails: {
						walletID: "sdliweoiruwir"
					}
				}
			};

			var actual = (new json_build(req))
				.get('body.pepitodetenera.walletID');
			assert.deepEqual(actual, expected, "Expected " + JSON.stringify(expected) + " but got: " + JSON.stringify(actual));

			done();
		});
	});
});