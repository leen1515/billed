/**
 * @jest-environment jsdom
 */

import {screen} from '@testing-library/dom'
import {ROUTES_PATH} from '../constants/routes.js'
import mockStore from '../__mocks__/store.js'
import router from '../app/Router.js'

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
  })
})
