const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function main () {
    // Hallo new world !!
    // tes main git
    
    const timeout = 1000000;

    const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

    await driver.get('https://aplikasi2.pertanian.go.id/bdsp/id/komoditas');
    
    loopSubsektor('subsektor');

    function waitUntilVisible(value) {
        return async () => {
            let webElementNext = driver.findElement({xpath: `//*[@name="${value}"]`});
            const result = await webElementNext.findElements(By.tagName('option'));
            if (result.length > 1) {
                return true;
            } else {
                return false;
            }
        }
    }

    async function loopSubsektor (value) {
        let webElement = await driver.findElement({xpath: `//*[@name="${value}"]`});
        let optionArray = await webElement.findElements(By.tagName('option'));
        if(optionArray.length > 1){
            for(let i=1; i<optionArray.length; i++){
                let optionValue = await optionArray[i].getAttribute('value');
                let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
                await elementSubsektor.click();
                await driver.wait(waitUntilVisible('indikator'), timeout);
                await loopIndikator('indikator');
            }
        }
    };
    
    async function loopIndikator (value) {
        let webElement = await driver.findElement({xpath: `//*[@name="${value}"]`});
        let optionArray = await webElement.findElements(By.tagName('option'));
        for(let i=1; i<optionArray.length; i++){
            let optionValue = await optionArray[i].getAttribute('value');
            let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
            await elementSubsektor.click();
            await driver.wait(waitUntilVisible('level'), timeout);
            await loopLevel('level')
        } 
    }
    
    async function loopLevel (value) {
        let webElement = await driver.findElement({xpath: `//*[@name="${value}"]`});
        let optionArray = await webElement.findElements(By.tagName('option'));
        for(let i=1; i<optionArray.length; i++){
            let optionValue = await optionArray[i].getAttribute('value');
            if(optionValue == 01){
                await dropdownYear();
            }else{
                let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
                await elementSubsektor.click();
                await driver.wait(waitUntilVisible('prov'), timeout);
                await loopProv('prov',optionValue);
            }
        } 
    }
    
    async function loopProv (value, level) {
        let webElement = await driver.findElement({xpath: `//*[@name="${value}"]`});
        let optionArray = await webElement.findElements(By.tagName('option'));
        for(let i=1; i<optionArray.length; i++){
            let optionValue = await optionArray[i].getAttribute('value');
            if(level == 03 ){
                let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
                await elementSubsektor.click();
                await driver.wait(waitUntilVisible('kab'), timeout);
                await loopKab('kab');
            }else {
                let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
                await elementSubsektor.click();
                await dropdownYear();
            }
        }
    }
    
    async function loopKab (value) {
        let webElement = await driver.findElement({xpath: `//*[@name="${value}"]`});
        let optionArray = await webElement.findElements(By.tagName('option'));
        for(let i=1; i<optionArray.length; i++){
            let optionValue = await optionArray[i].getAttribute('value');
            let elementSubsektor = await driver.findElement({xpath : `//select[@id="${value}"]/option[@value="${optionValue}"]`})
            await elementSubsektor.click();
            await dropdownYear();
        }
    }

    async function dropdownYear () {
        let elementStartYear = await driver.findElement({xpath : `//select[@id="tahunAwal"]/option[@value="2000"]`});
        await elementStartYear.click();
        let elementEndYear = await driver.findElement({xpath : `//select[@id="tahunAkhir"]/option[@value="2020"]`});
        await elementEndYear.click();
        let buttonDownload = await driver.findElement({xpath : `//button[@id="excel"]`});
        await buttonDownload.click();
    }
    
}

main();