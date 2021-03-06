module.exports = function(knex) {

  describe('Updates', function () {

    it('should handle updates', function() {
      return knex('accounts')
        .where('id', 1)
        .update({
          first_name: 'User',
          last_name: 'Test',
          email:'test100@example.com'
        }).testSql(function(tester) {
          tester(
            'mysql',
            'update `accounts` set `email` = ?, `first_name` = ?, `last_name` = ? where `id` = ?',
            ['test100@example.com','User','Test',1],
            1
          );
          tester(
            'postgresql',
            'update "accounts" set "email" = ?, "first_name" = ?, "last_name" = ? where "id" = ?',
            ['test100@example.com','User','Test',1],
            1
          );
          tester(
            'sqlite3',
            'update "accounts" set "email" = ?, "first_name" = ?, "last_name" = ? where "id" = ?',
            ['test100@example.com','User','Test',1],
            1
          );
        });
    });

    it('should allow for null updates', function() {
      return knex('accounts')
        .where('id', 1000)
        .update({
          first_name: null,
          last_name: 'Test',
          email:'test100@example.com'
        }).testSql(function(tester) {
          tester(
            'mysql',
            'update `accounts` set `email` = ?, `first_name` = ?, `last_name` = ? where `id` = ?',
            ['test100@example.com', null, 'Test', 1000],
            0
          );
        });
    });

    it('should increment a value', function() {
      return knex('accounts').select('logins').where('id', 1).then(function(accounts) {
        return knex('accounts').where('id', 1).increment('logins').then(function(rowsAffected) {
          expect(rowsAffected).to.equal(1);
          return knex('accounts').select('logins').where('id', 1);
        }).then(function(accounts2) {
          expect(accounts[0].logins + 1).to.equal(accounts2[0].logins);
        });
      });
    });

    it('should increment a negative value', function() {
      return knex('accounts').select('logins').where('id', 1).then(function(accounts) {
        return knex('accounts').where('id', 1).increment('logins', -2).then(function(rowsAffected) {
          expect(rowsAffected).to.equal(1);
          return knex('accounts').select('logins').where('id', 1);
        }).then(function(accounts2) {
          expect(accounts[0].logins - 2).to.equal(accounts2[0].logins);
        });
      });
    });

    it('should decrement a value', function() {
      return knex('accounts').select('logins').where('id', 1).then(function(accounts) {
        return knex('accounts').where('id', 1).decrement('logins').then(function(rowsAffected) {
          expect(rowsAffected).to.equal(1);
          return knex('accounts').select('logins').where('id', 1);
        }).then(function(accounts2) {
          expect(accounts[0].logins - 1).to.equal(accounts2[0].logins);
        });
      });
    });

    it('should decrement a negative value', function() {
      return knex('accounts').select('logins').where('id', 1).then(function(accounts) {
        return knex('accounts').where('id', 1).decrement('logins', -2).then(function(rowsAffected) {
          expect(rowsAffected).to.equal(1);
          return knex('accounts').select('logins').where('id', 1);
        }).then(function(accounts2) {
          expect(accounts[0].logins + 2).to.equal(accounts2[0].logins);
        });
      });
    });

    it('should allow returning for updates in postgresql', function() {

      return knex('accounts').where('id', 1).update({
        first_name: 'UpdatedUser',
        last_name: 'UpdatedTest',
        email:'test100@example.com'
      }, '*').testSql(function(tester) {
        tester(
          'mysql',
          'update `accounts` set `email` = ?, `first_name` = ?, `last_name` = ? where `id` = ?',
          ['test100@example.com','UpdatedUser','UpdatedTest',1],
          1
        );
        tester(
          'postgresql',
          'update "accounts" set "email" = ?, "first_name" = ?, "last_name" = ? where "id" = ? returning *',
          ['test100@example.com','UpdatedUser','UpdatedTest',1],
          [{
            id: '1',
            first_name: 'UpdatedUser',
            last_name: 'UpdatedTest',
            email: 'test100@example.com',
            logins: 1,
            about: 'Lorem ipsum Dolore labore incididunt enim.',
            created_at: d,
            updated_at: d,
            phone: null
          }]
        );
        tester(
          'sqlite3',
          'update "accounts" set "email" = ?, "first_name" = ?, "last_name" = ? where "id" = ?',
          ['test100@example.com','UpdatedUser','UpdatedTest',1],
          1
        );
      });

    });

  });

};
