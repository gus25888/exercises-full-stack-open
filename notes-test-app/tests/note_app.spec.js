const { beforeEach, describe, test, expect } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note App', () => {
  const user = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }
  beforeEach(async ({ page, request }) => {
    // Se usa endpoint generado para pruebas que realiza la limpieza de la BD.
    // Ver notes-backend, archivo controllers/testing.js

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: { ...user }
    })
    await page.goto('/')
  })


  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, user.username, user.password)

    await expect(page.getByText(user.name + ' logged-in')).toBeVisible()

  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, user.username, user.password + 'wrong')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText(user.name + ' logged-in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')

      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()

        await expect(page.getByText('make important')).toBeVisible()
      })
    })


    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = await page.getByText('second note')
        // locator acepta además, de selector CSS, indicadores de posición relativos, como en los directorios (selectores XPath).
        const otherNoteElement = await otherNoteText.locator('..')
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()

        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})