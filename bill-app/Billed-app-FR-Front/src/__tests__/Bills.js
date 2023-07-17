/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockedStore from "../__mocks__/store.js"
import {bills} from "../fixtures/bills.js"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockedStore)
//getBills containers/Bills.js
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee',}))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // verifie si l'id de l'icone contient la class   
			const isIconActivated = windowIcon.classList.contains("active-icon")
			expect(isIconActivated).toBeTruthy()
    })
    //test de la méthode sort dans le fichier views/BillsUI.js
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  // bouton 'nouvelle note de frais'
  describe("When i click on New Bill", () => {
    test("Then new bill's page is open", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      };
      // stock le mock de l'objet construisant les notes avec comme données : mockedStore
      const mockBill = new Bills({document, onNavigate, mockedStore, localStorage: window.localStorage})
      // stock le mock de sa méthode : permet de simuler le comportement de la fonction avec en argument 'event'
      const clickNewBill = jest.fn((e) => mockBill.handleClickNewBill(e))
      const newBillButton = screen.getByTestId("btn-new-bill")
      newBillButton.addEventListener("click", clickNewBill)
      // simule le click de l'utilisateur sur le bouton
      userEvent.click(newBillButton)
      // s'attend à que la fonction mockée soit appelée
      expect(clickNewBill).toHaveBeenCalled()
      // s'attend que la page nouvelle note s'affiche
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
  })
})
