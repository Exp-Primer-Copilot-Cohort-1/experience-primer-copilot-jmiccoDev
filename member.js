function skillsMember() {
    var member = {
        name: 'John Doe',
        age: 30,
        skills: ['js', 'html', 'css']
    };
    var memberJSON = JSON.stringify(member);
    var memberObject = JSON.parse(memberJSON);
    console.log(memberObject);
}