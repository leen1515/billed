/**
 * @jest-environment jsdom
 */

import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import {screen, waitFor, fireEvent} from '@testing-library/dom'
import {ROUTES, ROUTES_PATH} from '../constants/routes.js'
import {localStorageMock} from '../__mocks__/localStorage.js'
import mockStore from '../__mocks__/store.js'
import router from '../app/Router.js'
import BillsUI from '../views/BillsUI.js'
import Bills from '../containers/Bills.js'

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on the new bill page", () => {
    test("Then show the new bill page", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    test("Then mail icon in vertical layout should be highlighted", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      // vérifie que l'icone mail est bien sur active lorsque l'utilisateur visite la partie "nouvelle note"
      await waitFor(() => screen.getByTestId("icon-mail"))
      const mailIcon = screen.getByTestId("icon-mail")
      expect(mailIcon.className).toBe("active-icon")
    })
  })
})
