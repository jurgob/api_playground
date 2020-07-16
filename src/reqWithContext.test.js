import reqWithContext, {getObjectVal} from  './reqWithContext';


//

// 

test('responses.CAT_FACTS._id returns id', () => {
  const actual = getObjectVal('responses.CAT_FACTS._id', {responses: {CAT_FACTS: {_id:"id-dio-cane"} } })
  expect(actual).toBe("id-dio-cane");
});

test('responses.CAT_FACTS.0._id returns id', () => {
  const actual = getObjectVal('responses.CAT_FACTS.0._id', {responses: {CAT_FACTS: [ {_id:"id-dio-cane"} ]} })
  expect(actual).toBe("id-dio-cane");
});

test('request with no variable stay the same', () => {
  const context = {responses: {CAT_FACTS: [ {_id:"id-dio-cane"} ]} }
  const req = {
      "method": "get",
      "url": "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2"
    }
  const actual = reqWithContext(req, context)
  expect(actual).toStrictEqual({
      "method": "get",
      "url": "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2"
    });
});

test('request with no a variable in the url resolve correctly', () => {
  const context = {responses: {CAT_FACTS: [ {_id:"id-dio-cane"} ]} }
  const req = {
      "method": "get",
      "url": "https://cat-fact.herokuapp.com/facts/{{responses.CAT_FACTS.0._id}}"
    }
  const actual = reqWithContext(req, context)
  expect(actual).toStrictEqual({
      "method": "get",
      "url": "https://cat-fact.herokuapp.com/facts/id-dio-cane"
    });
});


test('request with no a variable in the data._id resolve correctly', () => {
  const context = {responses: {USERS: {name: "user-name"} }}
  const req = {
      "method": "post",
      "url": "https://cat-fact.herokuapp.com/facts",
      "data":{
        "user":{
          "name": "nameprefix-{{responses.USERS.name}}"
        }
      }
    }
  const actual = reqWithContext(req, context)
  expect(actual).toStrictEqual( {
      "method": "post",
      "url": "https://cat-fact.herokuapp.com/facts",
      "data":{
        "user": {
          "name": "nameprefix-user-name"
        }
      }
    });
});
