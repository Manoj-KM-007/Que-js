class Qcomponent{
    constructor({globals,methods,view,style}){
        this.data = globals
        this.methods = methods
        this.view = view
        this.style = style
        this.renderedViewHtml = "";
        this.makeGlobalMethodsandData();
        this.replaceMustache();
        this.updateView();
    } 
    listenToEvents(parent_name){
        const parent = document.querySelector(parent_name)
        if(!parent) return;
        const elementsWithVclickAttr = parent.querySelectorAll("[q-click]");
        const elementsWithTextAttr = parent.querySelectorAll("[q-text]");
        const elementsWithHTMLAttr = parent.querySelectorAll("[q-html]");
        const elementWithQcondition = parent.querySelectorAll("[q-if]");
        const elementsWithMouseInEffect =  parent.querySelectorAll("[q-mouse-in]")
        const elementsWithMouseOutEffect =  parent.querySelectorAll("[q-mouse-out]")
        elementsWithMouseInEffect.forEach(element =>{
            const attr = element.getAttribute("q-mouse-in");
            if(attr){
                element.addEventListener("mouseover",()=>{
                    this[attr]();
                    event.stopPropagation()
                    this.updateView()
                    this.render(parent_name)
                })
            }
        })
        elementsWithMouseOutEffect.forEach(element =>{
            const attr = element.getAttribute("q-mouse-out");
            if(attr){
                element.addEventListener("mouseout",()=>{
                    this[attr]();
                    this.updateView()
                    this.render(parent_name)
                })
            }
        })
        elementWithQcondition.forEach(element =>{
            const condition = element.getAttribute("q-if")
            if(!eval(condition)){
                element.innerHTML = "";
                this.updateView();
            }
    
        })
        elementsWithVclickAttr.forEach(element => {
            element.addEventListener("click",()=>{
                const attr = element.getAttribute("q-click")
                this[attr]();
                this.updateView()
                this.render(parent_name);
            }) 
        });
        elementsWithTextAttr.forEach(element =>{
                const attr = element.getAttribute("q-text")
                if(attr !== null){
                    element.innerText = this[attr];
                }
                this.updateView()
        })
        elementsWithHTMLAttr.forEach(element =>{
            const attr = element.getAttribute("q-html")
            if(attr !== null){
                element.innerHTML = attr;
            }
            this.updateView()
    })
       
    }
    render(parent_name){
        const parent = document.querySelector(parent_name)
        const styleElement = document.createElement("style")
        styleElement.innerText = this.style;
        document.head.appendChild(styleElement)
        if(parent){
        parent.innerHTML =  this.renderedViewHtml;
        this.listenToEvents(parent_name);
        }
    }
    
    makeGlobalMethodsandData(){
        for(const method in this.methods){
            this[method] = this.methods[method]
        }
        for(const data in this.data){
            this[data] = this.data[data]
        }
    }
    replaceMustache(){
        const pattern = /\{\{([^{}]+)\}\}/g
        this.matches = this.view['html'].match(pattern)
    }
    updateView(){
        this.renderedViewHtml = this.view['html']
        if(this.matches){
        for(const match of this.matches){
            const extractedKey = match.replace("{{","").replace("}}","").trim();
            this.renderedViewHtml = this.renderedViewHtml.replace(match,this[extractedKey]);
        }   
    }
    }
}

class Qform{
    constructor(form_obj,button_val,handleSubmit){
        this.form = document.createElement("form");
        this.button_val = button_val
        this.form_obj = form_obj
        this.handleSubmit = handleSubmit;
        this.formInputValues = {}
        this.createInputs();
        this.addSubmitButton();
        this.form.addEventListener("submit",this.onSubmit.bind(this))
    }
    onSubmit(e){
        e.preventDefault();
        this.form_obj.forEach(inputInfo =>{
            const inputId = inputInfo['id']
            const inputValue = this.form.querySelector(`#${inputId}`).value
            if(inputId){
                this.formInputValues[inputId] = inputValue;
            }
        })
        this.handleSubmit(this.formInputValues)
    }
    addSubmitButton(){
        const submit_button = document.createElement("button");
        submit_button.innerText = this.button_val
        this.form.appendChild(submit_button)
    }
    createInputs(){
        for(const inputInfo of this.form_obj){
            const inputPlaceHolder = inputInfo['placeholder'];
            const inputType = inputInfo['type']
            const inputID = inputInfo['id']
            const input = document.createElement("input")
            input.type = inputType;
            input.placeholder = inputPlaceHolder
            if(inputID){
                input.id = inputID
            }
            this.form.appendChild(input)                       
        }
    }
    render(parent_name){
        const parent = document.querySelector(parent_name);
        parent.appendChild(this.form);
    }
    
}

class Qrouter{
    constructor(routeInfoList){
        this.routeInfoList = routeInfoList
        this.init()
    }
    init() {
        window.addEventListener('load', ()=>{
            this.route();
        });
        window.addEventListener('hashchange',()=>{
            this.route()
        });
    }
    route(){
        const currentRoute = window.location.hash
        for(const routeInfo of this.routeInfoList){
            const route = routeInfo['route'];
            const component = routeInfo['component']
            if(route == currentRoute || route =="*"){
                component.render(routeInfo['render']);
            }
        }    
    }
}

class faker{
    constructor(){
         this.firstNames = [
            'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Isabella', 'Sophia', 'Elijah', 'Mia',
            'James', 'Charlotte', 'William', 'Amelia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail',
            'Alexander', 'Emily', 'Michael', 'Elizabeth', 'Ethan', 'Mila', 'Daniel', 'Ella', 'Matthew', 'Avery',
            'Jackson', 'Scarlett', 'Sebastian', 'Luna', 'David', 'Sofia', 'Joseph', 'Camila', 'Samuel', 'Aria',
            'Logan', 'Chloe', 'Mateo', 'Grace', 'Ryan', 'Victoria', 'Luke', 'Penelope', 'Jack', 'Nora'
        ];
        this.lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
            'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
            'Walker', 'Young', 'Hall', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
            'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter'
        ];
        this.fullNames = [
            'Emma Smith', 'Liam Johnson', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
            'William Garcia', 'Isabella Miller', 'James Davis', 'Sophia Rodriguez', 'Benjamin Martinez',
            'Mia Hernandez', 'Oliver Lopez', 'Charlotte Gonzalez', 'Elijah Wilson', 'Amelia Anderson',
            'Lucas Thomas', 'Harper Taylor', 'Mason Moore', 'Evelyn Jackson', 'Ethan Martin',
            'Emily Lee', 'Alexander Perez', 'Abigail Thompson', 'Michael White', 'Elizabeth Harris',
            'Daniel Sanchez', 'Sofia Clark', 'Matthew Ramirez', 'Avery Lewis', 'Jackson Robinson',
            'Ella Walker', 'David Young', 'Scarlett Hall', 'Logan Allen', 'Madison King', 'Joseph Wright',
            'Lily Scott', 'Samuel Torres', 'Grace Nguyen', 'Henry Hill', 'Chloe Flores', 'Sebastian Green',
            'Victoria Adams', 'Aiden Nelson', 'Riley Baker', 'Jack Hall', 'Penelope Rivera', 'Owen Campbell',
            'Zoe Mitchell'
        ];
        this.FakeEmails = [
            'emma.smith@example.com', 'liam.johnson@example.com', 'olivia.williams@example.com', 'noah.brown@example.com', 'ava.jones@example.com',
            'william.garcia@example.com', 'isabella.miller@example.com', 'james.davis@example.com', 'sophia.rodriguez@example.com', 'benjamin.martinez@example.com',
            'mia.hernandez@example.com', 'oliver.lopez@example.com', 'charlotte.gonzalez@example.com', 'elijah.wilson@example.com', 'amelia.anderson@example.com',
            'lucas.thomas@example.com', 'harper.taylor@example.com', 'mason.moore@example.com', 'evelyn.jackson@example.com', 'ethan.martin@example.com',
            'emily.lee@example.com', 'alexander.perez@example.com', 'abigail.thompson@example.com', 'michael.white@example.com', 'elizabeth.harris@example.com',
            'daniel.sanchez@example.com', 'sofia.clark@example.com', 'matthew.ramirez@example.com', 'avery.lewis@example.com', 'jackson.robinson@example.com',
            'ella.walker@example.com', 'david.young@example.com', 'scarlett.hall@example.com', 'logan.allen@example.com', 'madison.king@example.com', 'joseph.wright@example.com',
            'lily.scott@example.com', 'samuel.torres@example.com', 'grace.nguyen@example.com', 'henry.hill@example.com', 'chloe.flores@example.com', 'sebastian.green@example.com',
            'victoria.adams@example.com', 'aiden.nelson@example.com', 'riley.baker@example.com', 'jack.hall@example.com', 'penelope.rivera@example.com', 'owen.campbell@example.com',
            'zoe.mitchell@example.com'
        ];
        this.phoneNumbers = [
            '+1234567890', '+1987654321', '+1654321987', '+1765432198', '+1876543210',
            '+1543219876', '+1321987654', '+1456789012', '+1432198765', '+1345678901',
            '+1555555555', '+1666666666', '+1777777777', '+1888888888', '+1999999999',
            '+1000000000', '+1222333444', '+1444222333', '+1333444555', '+1555666777',
            '+1888999888', '+1222111333', '+1444333222', '+1333222111', '+1777333222',
            '+1222444333', '+1555333444', '+1888222111', '+1444222111', '+1777555444',
            '+1333888555', '+1222999888', '+1666999666', '+1888999777', '+1444999888',
            '+1333999777', '+1222111444', '+1777888444', '+1666777444', '+1999888333',
            '+1888777333', '+1777666222', '+1666555222', '+1555444222', '+1888333111',
            '+1222111111', '+1666666111', '+1333333111', '+1999999111', '+1888888111'
        ];
        this.loremIpsum = `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet sapien at sapien pharetra, id lacinia metus faucibus. Nullam sed justo sapien. Nam tincidunt, mi eget pharetra ultricies, ligula risus placerat odio, ac luctus eros enim et magna. Nullam interdum viverra neque, sed accumsan velit interdum at. Nulla aliquam, felis eu gravida interdum, turpis velit egestas ex, sed volutpat odio nunc nec est. Mauris bibendum sapien nec purus vestibulum luctus. Nullam molestie libero id enim varius faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus quis sapien eget dui feugiat facilisis eget at sapien. Nam auctor, lectus auctor pulvinar iaculis, justo lacus elementum risus, auctor vehicula metus odio ac eros. Vivamus vitae elit enim. Cras a nisl auctor, cursus enim vitae, cursus lectus. Fusce sit amet libero eget libero mattis dapibus nec in neque. Duis eleifend libero nec aliquet condimentum. Sed eu varius nunc. Sed vel ex et nulla pharetra viverra.

            Suspendisse potenti. Nam et nisl sed velit ultricies ullamcorper vel sit amet nisi. Fusce vel dictum erat, et feugiat arcu. Donec aliquet risus id lacus mattis, ut tincidunt sapien sodales. Duis interdum magna vel luctus sollicitudin. Integer pulvinar, justo nec congue varius, lorem enim gravida orci, ut volutpat eros odio non odio. In vel fermentum nunc, id aliquam nunc. Integer eget velit lacinia, volutpat purus in, sodales eros. Phasellus sed risus et tortor convallis vestibulum. Integer varius tellus quis metus suscipit, vel feugiat odio molestie. Sed vitae pharetra orci, nec volutpat quam. Duis ullamcorper sagittis orci, eget vehicula purus sollicitudin vel. Vivamus ac suscipit enim, in consequat magna. Vivamus nec aliquet magna. Sed dictum dui ac metus laoreet dictum.

            Proin id neque nec velit auctor ultricies. Nulla in fermentum arcu. Proin nec libero in urna faucibus dictum. Nam non accumsan purus. Donec rhoncus vel ex sit amet dictum. Duis dignissim turpis vel lacinia tincidunt. In bibendum varius odio, sed tincidunt nulla lacinia id. Phasellus tempus felis a velit vehicula, a aliquet nunc blandit. Phasellus in lectus urna. Curabitur consequat justo quis sem tincidunt ultricies. Sed quis efficitur mi. Sed vitae felis sapien. Cras ultricies nec sem nec rutrum. Nulla hendrerit euismod nunc at vulputate. Suspendisse potenti. Ut non fermentum erat. Sed aliquet erat et fermentum dictum.
            
            Vestibulum accumsan libero non velit vehicula, sit amet efficitur quam venenatis. Morbi dignissim, justo ac egestas pharetra, dui dolor suscipit nisi, sed tristique risus lorem eu enim. Mauris nec odio est. Suspendisse potenti. Aliquam euismod, purus ac bibendum accumsan, metus odio pellentesque lectus, ac consectetur tortor metus eu ex. Donec et turpis non orci cursus lacinia. Nullam feugiat, nulla et placerat dapibus, justo odio fringilla lacus, sit amet eleifend justo purus ut tortor. Phasellus rhoncus, neque ac congue laoreet, sapien est ultrices diam, at pharetra purus lorem vitae eros. Integer nec lorem lacus. Integer sit amet lectus enim. Nullam gravida nisi vel odio vehicula ullamcorper. Aliquam ut mollis quam, a sodales dui. Curabitur sed ultricies nisi. Nulla facilisi. Ut vel ligula vel odio maximus efficitur.
`;
    this.uniqueRandomUrls = [
        "https://www.example.com/page123",
        "https://www.test.com/post456",
        "https://www.demo.com/article789",
        "https://www.sample.com/blog321",
        "https://www.website.com/content654",
        "https://www.example.com/page987",
        "https://www.test.com/post210",
        "https://www.demo.com/article753",
        "https://www.sample.com/blog864",
        "https://www.website.com/content159",
        "https://www.example.com/page357",
        "https://www.test.com/post852",
        "https://www.demo.com/article246",
        "https://www.sample.com/blog963",
        "https://www.website.com/content741",
        "https://www.example.com/page582",
        "https://www.test.com/post369",
        "https://www.demo.com/article147",
        "https://www.sample.com/blog258",
        "https://www.website.com/content369",
        "https://www.example.com/page753",
        "https://www.test.com/post159",
        "https://www.demo.com/article258",
        "https://www.sample.com/blog357",
        "https://www.website.com/content852",
        "https://www.example.com/page369",
        "https://www.test.com/post741",
        "https://www.demo.com/article369",
        "https://www.sample.com/blog951",
        "https://www.website.com/content147",
        "https://www.example.com/page852",
        "https://www.test.com/post369",
        "https://www.demo.com/article852",
        "https://www.sample.com/blog369",
        "https://www.website.com/content963",
        "https://www.example.com/page147",
        "https://www.test.com/post852",
        "https://www.demo.com/article369",
        "https://www.sample.com/blog741",
        "https://www.website.com/content258",
        "https://www.example.com/page963",
        "https://www.test.com/post147",
        "https://www.demo.com/article582",
        "https://www.sample.com/blog852",
        "https://www.website.com/content753",
        "https://www.example.com/page258",
        "https://www.test.com/post963",
        "https://www.demo.com/article741",
        "https://www.sample.com/blog147",
        "https://www.website.com/content369"
    ];
    this.FakeAddresses = [
        "123 Main St, Springfield, IL 62701",
        "456 Oak St, Maplewood, NJ 07040",
        "789 Elm St, Boulder, CO 80302",
        "321 Pine St, Seattle, WA 98101",
        "654 Birch St, Portland, OR 97201",
        "987 Cedar St, Austin, TX 78701",
        "210 Walnut St, San Francisco, CA 94102",
        "753 Maple St, Boston, MA 02108",
        "864 Spruce St, Denver, CO 80202",
        "159 Ash St, Atlanta, GA 30301",
        "357 Willow St, New York, NY 10001",
        "852 Pine St, Chicago, IL 60601",
        "246 Cedar St, Los Angeles, CA 90001",
        "963 Elm St, Miami, FL 33101",
        "741 Birch St, Dallas, TX 75201",
        "582 Oak St, Philadelphia, PA 19101",
        "369 Maple St, Houston, TX 77001",
        "147 Pine St, Phoenix, AZ 85001",
        "258 Birch St, Las Vegas, NV 89101",
        "369 Elm St, San Diego, CA 92101",
        "753 Ash St, Orlando, FL 32801",
        "852 Walnut St, Nashville, TN 37201",
        "147 Oak St, New Orleans, LA 70112",
        "369 Pine St, Detroit, MI 48201",
        "963 Cedar St, Minneapolis, MN 55401",
        "147 Elm St, Charlotte, NC 28201",
        "852 Maple St, Baltimore, MD 21201",
        "369 Cedar St, Pittsburgh, PA 15201",
        "741 Elm St, Indianapolis, IN 46201",
        "258 Oak St, San Antonio, TX 78201",
        "963 Pine St, Salt Lake City, UT 84101",
        "147 Cedar St, Kansas City, MO 64101",
        "369 Elm St, Raleigh, NC 27601",
        "852 Birch St, Cincinnati, OH 45201",
        "147 Pine St, Columbus, OH 43201",
        "369 Maple St, Milwaukee, WI 53201",
        "963 Elm St, St. Louis, MO 63101",
        "147 Birch St, Memphis, TN 38101",
        "852 Cedar St, Denver, CO 80201",
        "369 Oak St, Portland, OR 97201",
        "741 Elm St, Sacramento, CA 95814",
        "258 Cedar St, Oakland, CA 94601",
        "963 Maple St, Long Beach, CA 90802",
        "147 Pine St, Santa Ana, CA 92701",
        "852 Elm St, Anaheim, CA 92801",
        "369 Birch St, Riverside, CA 92501",
        "741 Cedar St, Stockton, CA 95202",
        "258 Oak St, Fremont, CA 94536",
        "963 Maple St, Irvine, CA 92602",
        "147 Pine St, San Bernardino, CA 92401"
    ];
    
    }

    getRandomFakeData(array){
        const randomIndex = Math.floor(Math.random()*50)
        return array[randomIndex];
    }
    firstname(){
        return this.getRandomFakeData(this.firstNames)
    }
    firstnames(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i <= n;i++){
            fakerData.push(this.getRandomFakeData(this.firstNames));
        }
        return fakerData;
    }
    lastname(){
        return this.getRandomFakeData(this.lastNames)
    }
    lastnames(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.lastNames));
        }
        return fakerData;
    }
    name(){
        return this.getRandomFakeData(this.fullNames)
    }
    names(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.fullNames));
        }
        return fakerData;
    }
    email(){
        return this.getRandomFakeData(this.FakeEmails)
    }
    emails(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.FakeEmails));
        }
        return fakerData;
    }
    phonenumber(){
        return this.getRandomFakeData(this.phoneNumbers)
    }
    phonenumbers(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.phoneNumbers));
        }
        return fakerData;
    }
    loremipsum(size){
        const paras = this.loremIpsum.split("\n\n")
        const small = paras[1]
        const medium = small + paras[2]
        const large = small + medium + paras[3]
        if(size == "small"){
            return small
        }else if(size == "medium"){
            return medium
        }else if(size == "large"){
            return large;
        }else{
            console.error("Qfaker says: LoremIpsum method takes invalid parameter")
            return null;
        }
    }
    url(){
        return this.getRandomFakeData(this.uniqueRandomUrls)
    }
    urls(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.uniqueRandomUrls));
        }
        return fakerData;
    }
    address(){
        return this.getRandomFakeData(this.FakeAddresses)
    }
    addresses(n){
        if(n > 50){
            return null;
        }
        let fakerData = []
        for(let i =0;i < n;i++){
            fakerData.push(this.getRandomFakeData(this.FakeAddresses));
        }
        return fakerData;
    }
}

const Qfaker = new faker();
