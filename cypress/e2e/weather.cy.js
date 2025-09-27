describe("Weather App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("loads homepage and shows default city", () => {
    cy.contains("☁️ Weather+");
    cy.contains("Baku");
  });

  it("searches for London", () => {
    cy.get("[data-cy=city-input]").type("London{enter}");
    cy.contains("City:").find("b").should("have.text", "London");
  });

  it("toggles weather and pomodoro panels", () => {
    cy.get("details.nav-dropdown summary").click(); // open dropdown
    cy.get("[data-cy=toggle-weather]").click();
    cy.contains("Weather App").should("not.exist");

    cy.get("[data-cy=toggle-pomodoro]").click();
    cy.get("[data-cy=pomodoro]").should("not.exist");
  });

  it("toggles music", () => {
    cy.get("details.nav-dropdown summary").click();
    cy.get("[data-cy=toggle-music]").click();
    cy.get("[data-cy=toggle-music]").should("contain.text", "Music On");

    cy.get("[data-cy=toggle-music]").click();
    cy.get("[data-cy=toggle-music]").should("contain.text", "Music Off");
  });

  it("toggles weather panel on button click", () => {
    cy.get("details.nav-dropdown summary").click();
    cy.get("[data-cy=toggle-weather]").click();
    cy.contains("Weather App").should("not.exist");

    cy.get("[data-cy=toggle-weather]").click();
    cy.contains("Weather App").should("exist");
  });

  it("toggles pomodoro panel on button click", () => {
    cy.get("details.nav-dropdown summary").click();
    cy.get("[data-cy=toggle-pomodoro]").click();
    cy.get("[data-cy=pomodoro]").should("not.exist");

    cy.get("[data-cy=toggle-pomodoro]").click();
    cy.get("[data-cy=pomodoro]").should("exist");
  });

  it("toggles music button text", () => {
    cy.get("details.nav-dropdown summary").click();
    cy.get("[data-cy=toggle-music]").click();
    cy.get("[data-cy=toggle-music]").should("contain.text", "Music On");

    cy.get("[data-cy=toggle-music]").click();
    cy.get("[data-cy=toggle-music]").should("contain.text", "Music Off");
  });

  it("displays weekly forecast cards", () => {
    cy.get(".forecast").children().should("have.length.at.least", 1);
  });

  it("switches app language to Italian", () => {
    // cy.get(".hamburger").click(); 
    cy.get("select.nav-button").select("it");
    cy.contains("Meteo").should("exist");
  });

  it("switches app language to Spanish", () => {
    // cy.get(".hamburger").click(); 
    cy.get("select.nav-button").select("es");
    cy.contains("Clima").should("exist");
  });

  it("updates the clock every second", () => {
    cy.intercept("GET", "https://api.open-meteo.com/**").as("weather");
    cy.wait("@weather");
    cy.get(".clock").should("not.be.empty");
    cy.get(".clock")
      .invoke("text")
      .then((time1) => {
        cy.wait(2000);
        cy.get(".clock")
          .invoke("text")
          .should((time2) => {
            expect(time2).not.to.eq(time1);
          });
      });
  });

  it("starts and stops the pomodoro timer", () => {
    cy.get("[data-cy=pomodoro]").should("exist");
    cy.get("[data-cy=pomodoro-timer]")
      .invoke("text")
      .then((initial) => {
        cy.get("[data-cy=pomodoro-startstop]").click();
        cy.wait(2000);
        cy.get("[data-cy=pomodoro-timer]")
          .invoke("text")
          .should((after) => {
            expect(after).not.to.eq(initial);
          });
      });

    cy.get("[data-cy=pomodoro-startstop]").click();
    cy.get("[data-cy=pomodoro-startstop]").should("contain.text", "Start");
  });

  it("resets the pomodoro timer", () => {
    cy.get("[data-cy=pomodoro-startstop]").click();
    cy.wait(2000);
    cy.get("[data-cy=pomodoro-reset]").click();
    cy.get("[data-cy=pomodoro-timer]").should("contain.text", "25:00");
  });

  it("sets a custom pomodoro time", () => {
    cy.get("[data-cy=pomodoro-input]").clear().type("1");
    cy.get("[data-cy=pomodoro-set]").click();
    cy.get("[data-cy=pomodoro-timer]").should("contain.text", "10:00");
  });

  it("shows modal when session completes", () => {
    cy.get("[data-cy=pomodoro-input]").clear().type("0");
    cy.get("[data-cy=pomodoro-set]").click();
    cy.get("[data-cy=pomodoro-startstop]").click();
    cy.wait(1000);
    cy.get("[data-cy=pomodoro-modal]").should("exist");
    cy.get("[data-cy=pomodoro-start-break]").should("exist");
    cy.get("[data-cy=pomodoro-skip-break]").should("exist");
  });
});
